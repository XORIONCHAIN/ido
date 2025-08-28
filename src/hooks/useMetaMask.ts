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
// In useMetamask.ts - Replace the sendToken function:
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

      // FIX: First reset approval to 0 (especially important for USDT)
      try {
        const resetTx = await token.approve(IDO_CONTRACT_ADDRESS, 0, {
          gasLimit: 50000 // Specific gas limit for reset
        });
        await resetTx.wait();
        console.log("Reset approval successful");
      } catch (resetError) {
        console.log("Reset approval may not be needed or failed:", resetError);
        // Continue anyway - some tokens don't need this
      }

      // FIX: Use higher gas limit for approval
      const approveTx = await token.approve(IDO_CONTRACT_ADDRESS, parsedAmount, {
        gasLimit: 100000 // Increased gas limit
      });
      await approveTx.wait();

      const ido = new ethers.Contract(IDO_CONTRACT_ADDRESS, IDO_ABI, signer);

      const recipientU8a = decodeAddress(xorionRecipient);
      const recipientHex = u8aToHex(recipientU8a);

      const depositTx = await ido.deposit(parsedAmount, recipientHex, {
        gasLimit: 200000 // Increased gas for deposit
      });
      await depositTx.wait();

      return depositTx.hash;
    } catch (err: any) {
      console.error("Send token error:", err);
      
      // Provide more specific error messages
      if (err.message.includes("user rejected")) {
        throw new Error("Transaction rejected by user");
      } else if (err.message.includes("insufficient funds")) {
        throw new Error("Insufficient ETH for gas fees");
      } else if (err.message.includes("blacklist") || err.message.includes("not allowed")) {
        throw new Error("This address may be restricted from trading this token");
      } else {
        throw new Error(err.message || "Transaction failed");
      }
    }
  },
  []
);

  return { ...state, connectWallet, disconnectWallet, sendToken };
}
