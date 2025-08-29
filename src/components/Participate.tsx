import { useEffect, useState } from "react";
import SelectCryptoComp from "./SelectCryptoComp";
import { FaCaretDown } from 'react-icons/fa'
import { toast } from "sonner";
import { useLaunchClaim } from "@/hooks/useLaunchClaim";
import { ENDPOINTS } from "@/stores/polkadotStore";
import { ethers } from "ethers";
import { wl } from "@/lib/utils";
import SelectCryptoNet from "./SelectCryptoNet";
import { useTokenPrices,TOKEN_IDS  } from "@/hooks/useTokenPrice";
import { TOKEN_CONTRACTS } from "@/lib/networks";


type Props = {
  isConnected: boolean;
  account: string | null;
  connectWallet: (network: 'ETH' | 'BSC') => void;
  disconnectWallet: ()=>void;
  sendToken: ( tokenAddress:string, amount: string, recipient: string) => Promise<string>;
  idoContract: string;
  currentNetwork:  'ETH' | 'BSC'
  switchNetwork: (network: 'ETH' | 'BSC') => void;
  tokenBalances;
  refreshBalances;
};

const Participate = ({ isConnected, account, connectWallet,disconnectWallet, 
  sendToken,  currentNetwork,
  switchNetwork,tokenBalances,refreshBalances}: Props) => {

    const [open, setOpen] = useState(false);
    const [openNet, setOpenNet] = useState(false);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('')
    const [xorionAddress, setXorionAddress] = useState("");
    const [balance, setBalance] = useState("0");
    const [selectedNetwork, setSelectedNetwork] = useState<'ETH' | 'BSC'>(currentNetwork);
  const availableTokens = Object.keys(TOKEN_IDS);
  const { prices, loading: pricesLoading, error: priceError } = useTokenPrices(availableTokens);

const launchClaim = useLaunchClaim(xorionAddress || null, ENDPOINTS[0]);
const { contribution, isReady, claimTokens, error } = launchClaim;
  
const XOR_PRICE_PER_DOLLAR = 0.05;

// const tokenContract = {
//   "USDT":"0xdAC17F958D2ee523a2206206994597C13D831ec7",
//     "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
// }; 

// const ERC20_ABI = [
//   "function decimals() view returns (uint8)",
//   "function balanceOf(address owner) view returns (uint256)"
// ];


const toggleDropdown = () => setOpen(!open);
const toggleDropdownNet = () => setOpenNet(!openNet);

  // const handleBuy = async () => {
  //     // console.log('buying called')
  //     let valueStr
  //   if (!isConnected) {
  //     toast.error("Please connect your wallet first");
  //     return;
  //   }
  //   if (!amount || Number(amount) <= 0) {
  //     toast.error("Enter a valid amount");
  //     return;
  //   }
  //   if (!xorionAddress) {
  //     toast.error("Enter your Xorion address");
  //     return;
  //   }
  //   const normalized = account.toLowerCase();
  //   const foundTier = Object.entries(wl).find(
  //         ([addr]) => addr.toLowerCase() === normalized
  //       );
  //     if(foundTier){
  //       let value = Number(amount)
  //       value = value + (value * 0.01)
  //       valueStr = String(value)
  //     }else{
  //       valueStr = amount
  //     }
  //   try {
  //     setLoading(true);
      
  //     const hash = await sendToken(tokenContract[token], valueStr, xorionAddress);
  //     console.log('xor: ', xorionAddress)
  //     toast.success("Transaction sent!", {
  //       description: `Hash: ${hash}`,
  //       action: {
  //         label: "View",
  //         onClick: () =>
  //           window.open(`https://etherscan.io/tx/${hash}`, "_blank"),
  //       },
  //     });
  //   } catch (err: any) {
  //     toast.error(err.message || "Transaction failed");
  //   } finally {
  //     setLoading(false);
  //     setAmount('')
  //     setToken('')
  //     setXorionAddress('')
  //   }
  //     };


  // Participate.tsx - Improve error handling
const handleBuy = async () => {
  if (!isConnected) {
    toast.error("Please connect your wallet first");
    return;
  }
  if (!amount || Number(amount) <= 0) {
    toast.error("Enter a valid amount");
    return;
  }
  if (!xorionAddress) {
    toast.error("Enter your Xorion address");
    return;
  }

  const normalized = account.toLowerCase();
  const foundTier = Object.entries(wl).find(
    ([addr]) => addr.toLowerCase() === normalized
  );
  
  let finalAmount = amount;
  if (foundTier) {
    const value = Number(amount) + (Number(amount) * 0.01);
    finalAmount = String(value);
  }

  try {
    setLoading(true);
    const hash = await sendToken(token, finalAmount, xorionAddress);
    
    // Only show success if we have a valid hash
    if (hash && hash !== 'undefined') {
      const explorerUrl = selectedNetwork === 'ETH' 
        ? `https://etherscan.io/tx/${hash}`
        : `https://bscscan.com/tx/${hash}`;
      
      toast.success("Transaction sent!", {
        description: `Hash: ${hash}`,
        action: {
          label: "View",
          onClick: () => window.open(explorerUrl, "_blank"),
        },
      });
    } else {
      throw new Error("Transaction failed - no transaction hash received");
    }
  } catch (err: any) {
    // Don't show error for user cancellations
    if (err.message.includes("rejected") || err.message.includes("cancelled")) {
      toast.info("Transaction cancelled");
    } else {
      toast.error(err.message || "Transaction failed");
    }
    console.error("Transaction error:", err);
  } finally {
    setLoading(false);
    // Only reset form on successful transaction
    if (!error) {
      setAmount('');
      setToken('');
      setXorionAddress('');
    }
  }
};

  // 2
  //  const handleBuy = async () => {
  //   if (!isConnected) {
  //     toast.error("Please connect your wallet first");
  //     return;
  //   }
  //   if (!amount || Number(amount) <= 0) {
  //     toast.error("Enter a valid amount");
  //     return;
  //   }
  //   if (!xorionAddress) {
  //     toast.error("Enter your Xorion address");
  //     return;
  //   }

  //   const normalized = account.toLowerCase();
  //   const foundTier = Object.entries(wl).find(
  //     ([addr]) => addr.toLowerCase() === normalized
  //   );
    
  //   let finalAmount = amount;
  //   if (foundTier) {
  //     const value = Number(amount) + (Number(amount) * 0.01);
  //     finalAmount = String(value);
  //   }

  //   try {
  //     setLoading(true);
  //     const hash = await sendToken(token, finalAmount, xorionAddress);
      
  //     const explorerUrl = selectedNetwork === 'ETH' 
  //       ? `https://etherscan.io/tx/${hash}`
  //       : `https://bscscan.com/tx/${hash}`;
      
  //     toast.success("Transaction sent!", {
  //       description: `Hash: ${hash}`,
  //       action: {
  //         label: "View",
  //         onClick: () => window.open(explorerUrl, "_blank"),
  //       },
  //     });
  //   } catch (err: any) {
  //     toast.error(err.message || "Transaction failed");
  //   } finally {
  //     setLoading(false);
  //     setAmount('');
  //     setToken('');
  //     setXorionAddress('');
  //   }
  // };

 const xorEquiv = (amount: string) => {
    if (!token || !prices[token] || !amount || Number(amount) <= 0) {
      return null;
    }

    try {
      const tokenPrice = prices[token].usd;
      const amountInUSD = Number(amount) * tokenPrice;
      const xorAmount = amountInUSD * XOR_PRICE_PER_DOLLAR;

      const formattedAmount = Number(amount).toLocaleString();
      const formattedXorAmount = xorAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });

      return (
        <div className="w-full text-right text-white py-2 px-3">
          <p className="text-sm">
            {`${formattedAmount} ${token} = ${formattedXorAmount} XOR`}
          </p>
          <p className="text-xs text-gray-300">
            {`Rate: 1 XOR = $${(1 / XOR_PRICE_PER_DOLLAR).toFixed(2)} | ${token} price: $${tokenPrice.toFixed(4)}`}
          </p>
          {priceError && (
            <p className="text-xs text-yellow-400">
              Using cached prices - {priceError}
            </p>
          )}
        </div>
      );
    } catch (error) {
      console.error('Error calculating XOR equivalent:', error);
      return null;
    }
  };


  //   const getEstimatedXOR = (amount: string): number => {
  //   if (!token || !prices[token] || !amount || Number(amount) <= 0) {
  //     return 0;
  //   }
    
  //   const tokenPrice = prices[token].usd;
  //   const amountInUSD = Number(amount) * tokenPrice;
  //   return amountInUSD * XOR_PRICE_PER_DOLLAR;
  // };

// useEffect(() => {
//   const fetchBalance = async () => {
//     if (!window.ethereum || !account || !token) return;

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       const tokenAddress = tokenContract[token];
//       if (!tokenAddress) return;

//       const tokenInstance = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
//       const decimals = await tokenInstance.decimals();
//       const rawBalance = await tokenInstance.balanceOf(account);
//       const formattedBalance = ethers.formatUnits(rawBalance, decimals);

//       setBalance(formattedBalance);
//     } catch (err) {
//       console.error("Failed to fetch balance:", err);
//       setBalance("0");
//     }
//   };

//   fetchBalance();
// }, [account, token]);

//  useEffect(() => {
//     const fetchBalance = async () => {
//       if (!window.ethereum || !account || !token) return;

//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();

//         // Handle native BNB balance
//         if (token === 'BNB') {
//           const balance = await provider.getBalance(account);
//           const formattedBalance = ethers.formatEther(balance);
//           setBalance(formattedBalance);
//           return;
//         }

//         // Handle ERC20 tokens
//         const tokenAddress = TOKEN_CONTRACTS[selectedNetwork][token];
//         if (!tokenAddress) return;

//         const tokenInstance = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
//         const decimals = await tokenInstance.decimals();
//         const rawBalance = await tokenInstance.balanceOf(account);
//         const formattedBalance = ethers.formatUnits(rawBalance, decimals);

//         setBalance(formattedBalance);
//       } catch (err) {
//         console.error("Failed to fetch balance:", err);
//         setBalance("0");
//       }
//     };

//     fetchBalance();
//   }, [account, token, selectedNetwork]);

  const handleNetworkChange = async (network: 'ETH' | 'BSC') => {
    try {
      if(isConnected){

        await switchNetwork(network);
      }
      setSelectedNetwork(network);
      setToken(''); 
      setBalance('0');
    } catch (error: any) {
      toast.error(`Failed to switch network: ${error.message}`);
      setSelectedNetwork(currentNetwork);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet(selectedNetwork);
    } catch (error: any) {
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  const handleMaxClick = () => {
    if (token === 'BNB') {
      const estimatedGas = 0.01;
      const maxAmount = Math.max(0, Number(balance) - estimatedGas);
      setAmount(maxAmount > 25000 ? "25000" : maxAmount.toFixed(8));
    } else {
      setAmount(balance && Number(balance) > 25000 ? "25000" : balance);
    }
  };


  return (
     <div className="flex flex-col h-fit pb-10 gap-6 mt-5 px-2 md:px-6 xl:px-10">

        <div className="flex flex-col gap-4 items-center">

{/* network selector  */}
            <div className="w-full relative">
              <button
                onClick={toggleDropdownNet}
                className={`w-full py-4 px-3 rounded-[8px] ${open ? 'rounded-b-none' : null} bg-[#D9D9D9] flex justify-between items-center text-black font-clash text-[18px]`}
              >
                {selectedNetwork ? selectedNetwork : 'Select Crypto'}
                <FaCaretDown
                  className={`transition-transform duration-200 ${
                    openNet ? "rotate-180" : ""
                  }`}
                />
              </button>
            
                {openNet && (
                  <SelectCryptoNet 

                          handleNetworkChange={handleNetworkChange}
                          toggleDropdownNet={toggleDropdownNet}/>
                )}
            </div>

{/* connect wallet  */}

            <div className="w-full">
              <button
              onClick={isConnected ? disconnectWallet : handleConnectWallet}
              className="font-clash w-full py-4 px-3 rounded-[8px] bg-[#D9D9D9] font-normal text-[18px] leading-[100%] tracking-[0] text-black flex justify-between items-center"
            >
                {isConnected ? account?.slice(0, 6) + "..." + account?.slice(-4) : "Connect Wallet"}
                <div className="flex gap-4">
                  <img src="/metamask.svg" className="w-6 h-6" />
                  <img src="/walletconnect.svg" className="w-6 h-6" />
                </div>
              </button>
            </div>

{/* select cdrypto  */}
            <div className="w-full relative">
              <button
                onClick={toggleDropdown}
                className={`w-full py-4 px-3 rounded-[8px] ${open ? 'rounded-b-none' : null} bg-[#D9D9D9] flex justify-between items-center text-black font-clash text-[18px]`}
              >
                {token ? token : 'Select Crypto'}
                <FaCaretDown
                  className={`transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
            
                {open && (
                  <SelectCryptoComp
                          setToken={setToken}
                          toggleDropdown={toggleDropdown}
                          selectedNetwork={selectedNetwork}
                />)}
            </div>

                {token && <div className="w-full flex gap-2 items-center justify-end text-gray-50 text-sm py-1 px-2">
                  {/* <span>Balance: {Number(balance).toLocaleString()} {token}</span> */}
                  <span>Balance: {Number(tokenBalances[token]).toLocaleString()} {token}</span>
                  <button
                    onClick={() =>{
                      const currentBalance = tokenBalances[token] || "0"
                       setAmount(currentBalance && Number(currentBalance) > 25000 ? "25000" : currentBalance)
                      //  setAmount(balance && Number(balance) > 25000 ? "25000" : balance)
                         refreshBalances();
                    }}
                    className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-gray-400 text-xs"
                  >
                    Max
                  </button>
                </div>}
            
   {/* amount to invest           */}
            
            <input className="w-full rounded-[8px] font-clash py-4 px-3 h-full bg-[#D9D9D9] font-normal text-[18px] leading-[100%] tracking-[0] text-start text-black
                 focus:ring-2 focus:ring-black focus:outline-none placeholder:text-gray-600"
                 placeholder="Enter amount to invest"
                 value={amount}
                  max={25000}
                 onChange={(e) =>
                  {
                    const val = Number(e.target.value);
                    if (val > 25000) {
                      setAmount("25000");
                      toast.error("Maximum allowed amount is 25,000");
                    } else {
                      setAmount(e.target.value);
                    }
                  }}
                  />
            {amount && xorEquiv(amount)}
           
           
    {/* wallet address         */}
            <input
              className="w-full rounded-[8px] font-clash py-4 px-3 h-full bg-[#D9D9D9] font-normal text-[18px] leading-[100%] tracking-[0] text-start text-black
                focus:ring-2 focus:ring-black focus:outline-none placeholder:text-gray-600"
              placeholder="Enter your Xorion Address(talisman/subwallet)"
              value={xorionAddress}
              onChange={(e) => setXorionAddress(e.target.value)}
            />

        {contribution && (
          <div className="text-sm text-gray-700 flex gap-4">
            <span>Total: {contribution.total}</span>
            <span>Claimed: {contribution.claimed}</span>
            <span>Start: {contribution.start}</span>
          </div>
        )}


        </div>

{/* button buy */}
        <div className="flex justify-end w-full mx-auto">
            <button className="bg-[#583FB7] hover:bg-[#3f23af] w-full lg:w-[112px] py-4 text-center text-white
             font-clash font-normal text-[18px] rounded-[8px]"
             onClick={handleBuy}
             disabled={loading}>
            {loading ? "Processing..." : "Buy Now"}
            </button>
        </div>
        {error && <p className="text-red-600">{error}</p>}

  
    </div>

  )
}

export default Participate