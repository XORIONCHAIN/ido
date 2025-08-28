import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import SelectCrypto from "./SelectCrypto";
import { toast } from "sonner";
import { ENDPOINTS } from "@/stores/polkadotStore";
import { useLaunchClaim } from "@/hooks/useLaunchClaim";
import { wl } from "@/lib/utils";

type Props = {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => void;
    disconnectWallet: ()=>void;
  sendToken: ( amount: string, recipient: string) => Promise<string>;
  idoContract: string;
};

const Whitelist = ({ isConnected, account, connectWallet, disconnectWallet,sendToken, idoContract }: Props) => {
  // const [open, setOpen] = useState(false);
    // const [amount, setAmount] = useState("");
    // const [loading, setLoading] = useState(false);
    const [xorionAddress, setXorionAddress] = useState("");

    const launchClaim = useLaunchClaim(xorionAddress || null, ENDPOINTS[0]);
    const { contribution, isReady, claimTokens, error } = launchClaim;

      // const [checkAddress, setCheckAddress] = useState("");
  const [eligibility, setEligibility] = useState<null | { eligible: boolean; tier?: string }>(null);


  // const toggleDropdown = () => setOpen(!open);

  // const handleBuy = async () => {
  //     console.log('buying called')
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

  //   try {
  //     setLoading(true);
  //     let value = Number(amount)
  //     value = value + (value * 0.01)
  //     const valueStr = String(value)
  //     const hash = await sendToken(valueStr,xorionAddress);
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
  //   }
  //     };

   const checkEligibility = () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    const normalized = account.toLowerCase();
    const foundTier = Object.entries(wl).find(
      ([addr]) => addr.toLowerCase() === normalized
    );

    if (foundTier) {
      setEligibility({ eligible: true, tier: foundTier[1] });
      toast.success(`You are eligible - ${foundTier[1]}`);
    } else {
      setEligibility({ eligible: false });
      toast.error("You are not eligible");
    }
  };


  return (
    <div className="flex flex-col gap-6 mt-5 items-center px-2 md:px-6 xl:px-10 pb-10">
      
      <div className="w-full py-2 px-3 rounded-[8px] bg-[#D9D9D9] text-start flex justify-between items-center">
        <span className="font-clash font-normal md:text-[18px] text-black">
         {eligibility === null
            ? "Whitelist Check"
            : eligibility.eligible
            ? `You are eligible (${eligibility.tier})`
            : "You are not eligible"}
        </span>
            <button 
            onClick={checkEligibility}
            className="bg-[#583FB7] w-fit py-2 px-3 text-center text-white
             font-clash font-normal md:text-[18px] rounded-[8px]">
            Check Eligibility
            </button>
      </div>

      {/* <input 
      placeholder="Enter wallet to check eligibility"
      onChange={(e)=>setCheckAddress(e.target.value)}
      className="w-[1274px] rounded-[8px] font-clash py-4 px-3 h-full bg-[#D9D9D9] font-normal text-[18px] leading-[100%] tracking-[0] text-start text-black
                 focus:ring-2 focus:ring-black focus:outline-none placeholder:text-black " /> */}

      <div className="w-full">
            <button 
            onClick={isConnected ? disconnectWallet : connectWallet}
            className="font-clash w-full py-4 px-3 rounded-[8px] bg-[#D9D9D9] font-normal md:text-[18px] leading-[100%] tracking-[0] text-black flex justify-between items-center">
                {isConnected ? account?.slice(0, 6) + "..." + account?.slice(-4) : "Connect Wallet"}
                <div className="flex gap-4">
                    <img src="/metamask.svg" className="w-6 h-6"/>
                    <img src="/walletconnect.svg" className="w-6 h-6"/>
                </div>
            </button>
        </div>

      {/* <div className="w-[1274px] relative">
        <button
          onClick={toggleDropdown}
          className={`w-full py-4 px-3 rounded-[8px] ${open ? 'rounded-b-none' : null} bg-[#D9D9D9] flex justify-between items-center text-black font-clash text-[18px]`}
        >
          Select Crypto
          <FaCaretDown
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <SelectCrypto />
        )}
      </div> */}

      {/* <input 
      disabled={!eligibility?.eligible}
      placeholder="Enter amount to invest"
      className="w-[1274px] rounded-[8px] font-clash py-4 px-3 h-full bg-[#D9D9D9] font-normal text-[18px] leading-[100%] tracking-[0] text-start text-black
                 focus:ring-2 focus:ring-black focus:outline-none placeholder:text-black " />


         <div className="flex justify-end w-[1274px] mx-auto">
            <button className="bg-[#583FB7] hover:bg-[#3f23af] w-[112px] py-4 text-center text-white
             font-clash font-normal text-[18px] rounded-[8px]"
             onClick={handleBuy}
             disabled={loading || !eligibility?.eligible}
             >
            {loading ? "Processing..." : "Buy Now"}
            </button>
        </div> */}
        {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default Whitelist;
