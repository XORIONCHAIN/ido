import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { decodeAddress } from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import { switchEthereumNetwork } from "@/lib/utils";
import { toast } from "sonner";

const IDO_CONTRACT_ADDRESS = "0xd3f35ee0274369Dc6d99B0eD292f8f74bbAA8827";
const IDO_ABI = ["function deposit(uint256 amount, bytes calldata recipient) external"];
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 value) external returns (bool)",
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

type MetaMaskState = {
  account: string | null;
  chainId: string | null;
  isConnected: boolean;
  error: string | null;
};

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    account: null,
    chainId: null,
    isConnected: false,
    error: null,
  });

  // 🔌 connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not found");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await switchEthereumNetwork();

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await signer.signMessage("Sign in to My Dapp");

      setState({
        account: accounts[0],
        chainId,
        isConnected: true,
        error: null,
      });

      sessionStorage.setItem("isWalletConnected", "true");
      toast.success("Wallet connected!");
      return accounts[0];
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
      setState((s) => ({ ...s, error: error.message }));
    }
  };

  const disconnectWallet = useCallback(() => {
    setState({
      account: null,
      chainId: null,
      isConnected: false,
      error: null,
    });
    localStorage.removeItem("isWalletConnected");
  }, []);

  useEffect(() => {
    if (window.ethereum && localStorage.getItem("isWalletConnected") === "true") {
      (async () => {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            setState({
              account: accounts[0],
              chainId,
              isConnected: true,
              error: null,
            });
          }
        } catch (err) {
          console.error("Auto-connect failed", err);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      setState((s) => ({
        ...s,
        account: accounts.length > 0 ? accounts[0] : null,
        isConnected: accounts.length > 0,
      }));
    };

    const handleChainChanged = (chainId: string) => {
      setState((s) => ({ ...s, chainId }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // 🪙 send token (USDT / USDC depending on selection)
  const sendToken = useCallback(
    async (tokenAddress: string, amount: string, xorionRecipient: string) => {
      try {
        if (!window.ethereum || !tokenAddress) {
          throw new Error("Wallet or token contract not configured");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        const decimals: number = await token.decimals();
        const parsedAmount = ethers.parseUnits(amount, decimals);

        const approveTx = await token.approve(IDO_CONTRACT_ADDRESS, parsedAmount);
        await approveTx.wait();

        const ido = new ethers.Contract(IDO_CONTRACT_ADDRESS, IDO_ABI, signer);

        const recipientU8a = decodeAddress(xorionRecipient);
        const recipientHex = u8aToHex(recipientU8a);

        const depositTx = await ido.deposit(parsedAmount, recipientHex);
        await depositTx.wait();

        return depositTx.hash;
      } catch (err: any) {
        throw new Error(err.message || "Transaction failed");
      }
    },
    []
  );

  return { ...state, connectWallet, disconnectWallet, sendToken };
}
