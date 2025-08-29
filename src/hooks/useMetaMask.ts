import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { decodeAddress } from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
// import { switchEthereumNetwork } from "@/lib/utils";
import { toast } from "sonner";
import { IDO_CONTRACTS, NETWORKS, TOKEN_CONTRACTS } from "@/lib/networks";

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
  const [currentNetwork, setCurrentNetwork] = useState<'ETH' | 'BSC' | 'UNKNOWN'>('ETH');

// Enhanced fetchTokenBalances with better error handling
const fetchTokenBalances = useCallback(async (account: string, network: 'ETH' | 'BSC' | 'UNKNOWN') => {
  if (!window.ethereum || !account) return {};
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balances: { [token: string]: string } = {};

    // Fetch native token balance with timeout
    try {
      if (network === 'ETH') {
        const ethBalance = await Promise.race([
          provider.getBalance(account),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout fetching ETH balance')), 10000)
          )
        ]);
        balances['ETH'] = ethers.formatEther(ethBalance as bigint);
      } else {
        const bnbBalance = await Promise.race([
          provider.getBalance(account),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout fetching BNB balance')), 10000)
          )
        ]);
        balances['BNB'] = ethers.formatEther(bnbBalance as bigint);
      }
    } catch (error) {
      console.error('Error fetching native token balance:', error);
    }

    // Fetch ERC20 token balances in parallel with error handling
    const tokenContracts = TOKEN_CONTRACTS[network];
    const tokenPromises = Object.entries(tokenContracts)
      .filter(([symbol, address]) => 
        symbol !== 'ETH' && 
        symbol !== 'BNB' && 
        address !== '0x0000000000000000000000000000000000000000'
      )
      .map(async ([tokenSymbol, tokenAddress]) => {
        try {
          const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
          const [decimals, balance] = await Promise.all([
            token.decimals(),
            token.balanceOf(account)
          ]);
          return { tokenSymbol, balance: ethers.formatUnits(balance, decimals) };
        } catch (error) {
          console.error(`Failed to fetch ${tokenSymbol} balance:`, error);
          return { tokenSymbol, balance: '0' };
        }
      });

    const tokenResults = await Promise.allSettled(tokenPromises);
    tokenResults.forEach(result => {
      if (result.status === 'fulfilled') {
        balances[result.value.tokenSymbol] = result.value.balance;
      }
    });

    return balances;
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return {};
  }
}, []);


//  fetch token balances
// const fetchTokenBalances = useCallback(async (account: string, network: 'ETH' | 'BSC' | 'UNKNOWN') => {
//   if (!window.ethereum || !account) return {};
  
//   try {
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const balances: { [token: string]: string } = {};

//     // Fetch native token balance (ETH or BNB)
//     if (network === 'ETH') {
//       const ethBalance = await provider.getBalance(account);
//       balances['ETH'] = ethers.formatEther(ethBalance);
//     } else {
//       const bnbBalance = await provider.getBalance(account);
//       balances['BNB'] = ethers.formatEther(bnbBalance);
//     }

//     // Fetch ERC20 token balances
//     const tokenContracts = TOKEN_CONTRACTS[network];
//     for (const [tokenSymbol, tokenAddress] of Object.entries(tokenContracts)) {
//       // Skip native tokens and invalid addresses
//       if (tokenSymbol === 'ETH' || tokenSymbol === 'BNB' || tokenAddress === '0x0000000000000000000000000000000000000000') {
//         continue;
//       }

//       try {
//         const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
//         const decimals = await token.decimals();
//         const balance = await token.balanceOf(account);
//         balances[tokenSymbol] = ethers.formatUnits(balance, decimals);
//       } catch (error) {
//         console.error(`Failed to fetch ${tokenSymbol} balance:`, error);
//         balances[tokenSymbol] = '0';
//       }
//     }

//     return balances;
//   } catch (error) {
//     console.error('Error fetching token balances:', error);
//     return {};
//   }
// }, []);

// Create a state to store balances
const [tokenBalances, setTokenBalances] = useState<{ [token: string]: string }>({});
const [balancesLoading, setBalancesLoading] = useState(false);

// Create a function to refresh balances
const refreshBalances = useCallback(async () => {
  if (!state.account || !currentNetwork) return;
  
  try {
    setBalancesLoading(true);
    const balances = await fetchTokenBalances(state.account, currentNetwork);
    setTokenBalances(balances);
    return balances;
  } catch (error) {
    console.error('Failed to refresh balances:', error);
    return {};
  } finally {
    setBalancesLoading(false);
  }
}, [state.account, currentNetwork, fetchTokenBalances]);

  // 🔌 connect wallet
  const connectWallet = async (preferredNetwork?: 'ETH' | 'BSC') => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not found");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    
      const targetNetwork = preferredNetwork || 'ETH';

      await switchEthereumNetwork(targetNetwork);

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await signer.signMessage("Sign in to Xorion Chain");

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

  const switchEthereumNetwork = async (network: 'ETH' | 'BSC' = 'ETH') => {
  try {
    const networkConfig = NETWORKS[network];
    
    // Check current network first
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (currentChainId === networkConfig.chainId) {
      setCurrentNetwork(network);
      return; // Already on the correct network
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      });
      setCurrentNetwork(network);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
        setCurrentNetwork(network);
      } else if (switchError.code === 4001) {
        // User rejected the network switch
        throw new Error('Network switch rejected by user');
      } else {
        throw switchError;
      }
    }
  } catch (error: any) {
    console.error('Network switch error:', error);
    throw error;
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

  // useEffect(() => {
  //   if (window.ethereum && localStorage.getItem("isWalletConnected") === "true") {
  //     (async () => {
  //       try {
  //         const accounts = await window.ethereum.request({ method: "eth_accounts" });
  //         if (accounts.length > 0) {
  //           const chainId = await window.ethereum.request({ method: "eth_chainId" });
  //           setState({
  //             account: accounts[0],
  //             chainId,
  //             isConnected: true,
  //             error: null,
  //           });
  //         }
  //       } catch (err) {
  //         console.error("Auto-connect failed", err);
  //       }
  //     })();
  //   }
  // }, []);


  // account and chain change 
  
  
  // Add auto-network switching on connection

  useEffect(() => {
  if (window.ethereum && localStorage.getItem("isWalletConnected") === "true") {
    (async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: "eth_chainId" });
          const network = chainId === NETWORKS.ETH.chainId ? 'ETH' : 
                         chainId === NETWORKS.BSC.chainId ? 'BSC' : 
                         'ETH'; // Default to ETH if unknown
          
          setState({
            account: accounts[0],
            chainId,
            isConnected: true,
            error: null,
          });
          setCurrentNetwork(network);
        }
      } catch (err) {
        console.error("Auto-connect failed", err);
      }
    })();
  }
}, []);
  
  
  // useEffect(() => {
  //   if (!window.ethereum) return;

  //   const handleAccountsChanged = (accounts: string[]) => {
  //     setState((s) => ({
  //       ...s,
  //       account: accounts.length > 0 ? accounts[0] : null,
  //       isConnected: accounts.length > 0,
  //     }));
  //   };

  //   const handleChainChanged = (chainId: string) => {
  //     setState((s) => ({ ...s, chainId }));
  //   };

  //   window.ethereum.on("accountsChanged", handleAccountsChanged);
  //   window.ethereum.on("chainChanged", handleChainChanged);

  //   return () => {
  //     window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  //     window.ethereum.removeListener("chainChanged", handleChainChanged);
  //   };
  // }, []);

  // 🪙 send token (USDT / USDC depending on selection)
// In useMetamask.ts - Replace the sendToken function:
// const sendToken = useCallback(
//   async (tokenAddress: string, amount: string, xorionRecipient: string) => {
//     try {
//       if (!window.ethereum || !tokenAddress) {
//         throw new Error("Wallet or token contract not configured");
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
//       const decimals: number = await token.decimals();
//       const parsedAmount = ethers.parseUnits(amount, decimals);

//       // FIX: First reset approval to 0 (especially important for USDT)
//       try {
//         const resetTx = await token.approve(IDO_CONTRACT_ADDRESS, 0, {
//           gasLimit: 50000 // Specific gas limit for reset
//         });
//         await resetTx.wait();
//         console.log("Reset approval successful");
//       } catch (resetError) {
//         console.log("Reset approval may not be needed or failed:", resetError);
//         // Continue anyway - some tokens don't need this
//       }

//       // FIX: Use higher gas limit for approval
//       const approveTx = await token.approve(IDO_CONTRACT_ADDRESS, parsedAmount, {
//         gasLimit: 100000 // Increased gas limit
//       });
//       await approveTx.wait();

//       const ido = new ethers.Contract(IDO_CONTRACT_ADDRESS, IDO_ABI, signer);

//       const recipientU8a = decodeAddress(xorionRecipient);
//       const recipientHex = u8aToHex(recipientU8a);

//       const depositTx = await ido.deposit(parsedAmount, recipientHex, {
//         gasLimit: 200000 // Increased gas for deposit
//       });
//       await depositTx.wait();

//       return depositTx.hash;
//     } catch (err: any) {
//       console.error("Send token error:", err);
      
//       // Provide more specific error messages
//       if (err.message.includes("user rejected")) {
//         throw new Error("Transaction rejected by user");
//       } else if (err.message.includes("insufficient funds")) {
//         throw new Error("Insufficient ETH for gas fees");
//       } else if (err.message.includes("blacklist") || err.message.includes("not allowed")) {
//         throw new Error("This address may be restricted from trading this token");
//       } else {
//         throw new Error(err.message || "Transaction failed");
//       }
//     }
//   },
//   []
// );



useEffect(() => {
  if (!window.ethereum) return;

  const handleAccountsChanged = async (accounts: string[]) => {
    const newAccount = accounts.length > 0 ? accounts[0] : null;
    
    setState((s) => ({
      ...s,
      account: newAccount,
      isConnected: accounts.length > 0,
    }));
    
    // Reset network-specific states when account changes
    if (accounts.length > 0 && newAccount) {
      // Re-fetch balances for the new account
      refreshBalances();
      
      // Also refresh the UI components that depend on account
      
    } else {
      // User disconnected - clear balances
      setTokenBalances({});
      disconnectWallet();
    }
  };

  const handleChainChanged = async (chainId: string) => {
    // Detect network from chainId
    const network = chainId === NETWORKS.ETH.chainId ? 'ETH' : 
                   chainId === NETWORKS.BSC.chainId ? 'BSC' : 
                   'UNKNOWN';
    
    // Update both chainId and network state
    setState((s) => ({ ...s, chainId }));
    setCurrentNetwork(network);
    
    // Network-specific actions
    if (network !== 'UNKNOWN') {
      toast.success(`Switched to ${network} network`);
      
      // Refresh token balances for the new network
      if (state.account) {
        refreshBalances();
      }
      
      // Reset token selection if needed
      // if (onNetworkChange) {
      //   onNetworkChange(network);
      // }
    } else {
      toast.error("Unsupported network");
      setTokenBalances({});
    }
  };

  // Set up listeners
  window.ethereum.on("accountsChanged", handleAccountsChanged);
  window.ethereum.on("chainChanged", handleChainChanged);

  // Cleanup
  return () => {
    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    window.ethereum.removeListener("chainChanged", handleChainChanged);
  };
}, [currentNetwork, disconnectWallet, refreshBalances, state.account]); // Add refreshBalances and state.account


// const sendToken = useCallback(
//   async (tokenSymbol: string, amount: string, xorionRecipient: string) => {
//     try {
//       if (!window.ethereum) {
//         throw new Error("Wallet not connected");
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
      
//       const tokenAddress = TOKEN_CONTRACTS[currentNetwork][tokenSymbol];
//       const idoContractAddress = IDO_CONTRACTS[currentNetwork];

//       // Handle native BNB transfer
//       if (tokenSymbol === 'BNB') {
//         const ido = new ethers.Contract(idoContractAddress, IDO_ABI, signer);
//         const recipientU8a = decodeAddress(xorionRecipient);
//         const recipientHex = u8aToHex(recipientU8a);
        
//         const depositTx = await ido.deposit(0, recipientHex, {
//           value: ethers.parseEther(amount),
//           gasLimit: 200000
//         });
//         await depositTx.wait();
//         return depositTx.hash;
//       }

//       // Handle ERC20 tokens (USDT, USDC)
//       const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
//       const decimals: number = await token.decimals();
//       const parsedAmount = ethers.parseUnits(amount, decimals);

//       // Reset approval for ERC20 tokens
//       try {
//         const resetTx = await token.approve(idoContractAddress, 0, {
//           gasLimit: 50000
//         });
//         await resetTx.wait();
//       } catch (resetError) {
//         console.log("Reset approval:", resetError);
//       }

//       // Approve tokens
//       const approveTx = await token.approve(idoContractAddress, parsedAmount, {
//         gasLimit: 100000
//       });
//       await approveTx.wait();

//       // Deposit to IDO contract
//       const ido = new ethers.Contract(idoContractAddress, IDO_ABI, signer);
//       const recipientU8a = decodeAddress(xorionRecipient);
//       const recipientHex = u8aToHex(recipientU8a);

//       const depositTx = await ido.deposit(parsedAmount, recipientHex, {
//         gasLimit: 200000
//       });
//       await depositTx.wait();

//       return depositTx.hash;
//     } catch (err: any) {
//       console.error("Send token error:", err);
//       // Error handling remains the same
//     }
//   },
//   [currentNetwork]
// );


// Add network switching function


// useMetaMask.ts - Fix the sendToken function



const sendToken = useCallback(
  async (tokenSymbol: string, amount: string, xorionRecipient: string) => {
    try {
      if (!window.ethereum) {
        throw new Error("Wallet not connected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenAddress = TOKEN_CONTRACTS[currentNetwork][tokenSymbol];
      const idoContractAddress = IDO_CONTRACTS[currentNetwork];

      // Handle native BNB transfer
      if (tokenSymbol === 'BNB') {
        const ido = new ethers.Contract(idoContractAddress, IDO_ABI, signer);
        const recipientU8a = decodeAddress(xorionRecipient);
        const recipientHex = u8aToHex(recipientU8a);
        
        const depositTx = await ido.deposit(0, recipientHex, {
          value: ethers.parseEther(amount),
          gasLimit: 200000
        });
        
        const receipt = await depositTx.wait(); // Wait for transaction to be mined
        if (!receipt) {
          throw new Error("Transaction failed or was cancelled");
        }
        
        return depositTx.hash;
      }

      // Handle ERC20 tokens (USDT, USDC)
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const decimals: number = await token.decimals();
      const parsedAmount = ethers.parseUnits(amount, decimals);

      // Reset approval for ERC20 tokens
      try {
        const resetTx = await token.approve(idoContractAddress, 0, {
          gasLimit: 50000
        });
        await resetTx.wait();
      } catch (resetError) {
        console.log("Reset approval:", resetError);
      }

      // Approve tokens - add proper error handling for user rejection
      const approveTx = await token.approve(idoContractAddress, parsedAmount, {
        gasLimit: 100000
      });
      
      const approveReceipt = await approveTx.wait();
      if (!approveReceipt) {
        throw new Error("Approval transaction cancelled");
      }

      // Deposit to IDO contract
      const ido = new ethers.Contract(idoContractAddress, IDO_ABI, signer);
      const recipientU8a = decodeAddress(xorionRecipient);
      const recipientHex = u8aToHex(recipientU8a);

      const depositTx = await ido.deposit(parsedAmount, recipientHex, {
        gasLimit: 200000
      });
      
      const depositReceipt = await depositTx.wait();
      if (!depositReceipt) {
        throw new Error("Deposit transaction cancelled");
      }

      return depositTx.hash;
    } catch (err: any) {
      console.error("Send token error:", err);
      
      // Provide more specific error messages
      if (err.code === 4001 || err.message.includes("user rejected") || err.message.includes("rejected")) {
        throw new Error("Transaction rejected by user");
      } else if (err.message.includes("insufficient funds")) {
        throw new Error("Insufficient ETH/BNB for gas fees");
      } else if (err.message.includes("blacklist") || err.message.includes("not allowed")) {
        throw new Error("This address may be restricted from trading this token");
      } else if (err.message.includes("cancelled") || err.message.includes("undefined")) {
        throw new Error("Transaction was cancelled");
      } else {
        throw new Error(err.message || "Transaction failed");
      }
    }
  },
  [currentNetwork]
);




const switchNetwork = async (network: 'ETH' | 'BSC') => {
  try {
    await switchEthereumNetwork(network);
    toast.success(`Switched to ${network} network`);
  } catch (error: any) {
    toast.error(`Failed to switch network: ${error.message}`);
  }
};


//  initial balance load
useEffect(() => {
  if (state.account && currentNetwork && state.isConnected) {
    refreshBalances();
    
    const balanceInterval = setInterval(refreshBalances, 30000); 
    
    return () => clearInterval(balanceInterval);
  }
}, [state.account, currentNetwork, state.isConnected, refreshBalances]);


  return { ...state, 
    connectWallet, disconnectWallet, sendToken,
   currentNetwork,
  switchNetwork ,tokenBalances,        
  refreshBalances,      
  fetchTokenBalances,
balancesLoading  };
}
