import { useEffect, useState } from "react";
import SelectCrypto from "./SelectCrypto";
import { FaCaretDown } from 'react-icons/fa'
import { toast } from "sonner";
import { useLaunchClaim } from "@/hooks/useLaunchClaim";
import { ENDPOINTS } from "@/stores/polkadotStore";
import { ethers } from "ethers";
import { wl } from "@/lib/utils";


type Props = {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => void;
  disconnectWallet: ()=>void;
  sendToken: ( tokenAddress:string, amount: string, recipient: string) => Promise<string>;
  idoContract: string;
};

const Participate = ({ isConnected, account, connectWallet,disconnectWallet, sendToken, idoContract }: Props) => {

    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('')
    const [xorionAddress, setXorionAddress] = useState("");
    const [balance, setBalance] = useState("0");

const launchClaim = useLaunchClaim(xorionAddress || null, ENDPOINTS[0]);
const { contribution, isReady, claimTokens, error } = launchClaim;
//     if (!xorionAddress) {
//   return <p>Please enter a wallet address</p>;
// }

const tokenContract = {
  "USDT":"0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
}; 

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)"
];


const toggleDropdown = () => setOpen(!open);

  const handleBuy = async () => {
      // console.log('buying called')
      let valueStr
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
      if(foundTier){
        let value = Number(amount)
        value = value + (value * 0.01)
        valueStr = String(value)
      }else{
        valueStr = amount
      }
    try {
      setLoading(true);
      
      const hash = await sendToken(tokenContract[token], valueStr, xorionAddress);
      console.log('xor: ', xorionAddress)
      toast.success("Transaction sent!", {
        description: `Hash: ${hash}`,
        action: {
          label: "View",
          onClick: () =>
            window.open(`https://etherscan.io/tx/${hash}`, "_blank"),
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Transaction failed");
    } finally {
      setLoading(false);
      setAmount('')
      setToken('')
      setXorionAddress('')
    }
      };

     const xorEquiv = (amount: string) => {
  const valueEquiv = Number(amount) * 20;

  // Format both input amount and XOR equivalent with commas
  const formattedAmount = Number(amount).toLocaleString();
  const formattedValueEquiv = valueEquiv.toLocaleString();

  return (
    <p className="w-full text-right text-white py-2 px-3">
      {`${formattedAmount} ${token} = ${formattedValueEquiv} XOR`}
    </p>
  );
};

useEffect(() => {
  const fetchBalance = async () => {
    if (!window.ethereum || !account || !token) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenAddress = tokenContract[token];
      if (!tokenAddress) return;

      const tokenInstance = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const decimals = await tokenInstance.decimals();
      const rawBalance = await tokenInstance.balanceOf(account);
      const formattedBalance = ethers.formatUnits(rawBalance, decimals);

      setBalance(formattedBalance);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      setBalance("0");
    }
  };

  fetchBalance();
}, [account, token]);


  return (
     <div className="flex flex-col h-fit pb-10 gap-6 mt-5 px-2 md:px-6 xl:px-10">

        <div className="flex flex-col gap-4 items-center">

            <div className="w-full">
            <button
            onClick={isConnected ? disconnectWallet : connectWallet}
            className="font-clash w-full py-4 px-3 rounded-[8px] bg-[#D9D9D9] font-normal text-[18px] leading-[100%] tracking-[0] text-black flex justify-between items-center"
          >
            {isConnected ? account?.slice(0, 6) + "..." + account?.slice(-4) : "Connect Wallet"}
            <div className="flex gap-4">
              <img src="/metamask.svg" className="w-6 h-6" />
              <img src="/walletconnect.svg" className="w-6 h-6" />
            </div>
          </button>
            </div>

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
                  <SelectCrypto 
                          setToken={setToken}
                          toggleDropdown={toggleDropdown}/>
                )}
            </div>

                {token && <div className="w-full flex gap-2 items-center justify-end text-gray-50 text-sm py-1 px-2">
                  <span>Balance: {Number(balance).toLocaleString()} {token}</span>
                  <button
                    onClick={() => setAmount(balance && Number(balance) > 25000 ? "25000" : balance)}
                    className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded text-gray-400 text-xs"
                  >
                    Max
                  </button>
                </div>}
                {/* show user balance here */} {/* add a 'max' button here, when user clicks the total user fund is entered as value in the input below*/}
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