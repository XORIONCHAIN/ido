import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import SelectCrypto from "./SelectCrypto";
import { toast } from "sonner";
import { ENDPOINTS } from "@/stores/polkadotStore";
import { useLaunchClaim } from "@/hooks/useLaunchClaim";

type Props = {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => void;
    disconnectWallet: ()=>void;
  sendToken: ( amount: string, recipient: string) => Promise<string>;
  idoContract: string;
};

const Whitelist = ({ isConnected, account, connectWallet, disconnectWallet,sendToken, idoContract }: Props) => {
  const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [xorionAddress, setXorionAddress] = useState("");

    const launchClaim = useLaunchClaim(xorionAddress || null, ENDPOINTS[0]);
    const { contribution, isReady, claimTokens, error } = launchClaim;

      const [checkAddress, setCheckAddress] = useState("");
  const [eligibility, setEligibility] = useState<null | { eligible: boolean; tier?: string }>(null);


  // const toggleDropdown = () => setOpen(!open);

  const handleBuy = async () => {
      console.log('buying called')
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

    try {
      setLoading(true);
      let value = Number(amount)
      value = value + (value * 0.01)
      const valueStr = String(value)
      const hash = await sendToken(valueStr,xorionAddress);
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
    }
      };

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


  const wl = {
  "0x8a89a3c31A5Be9d65e9E1902394264fd29313cE0":"Tier 1",
  "0xF214cD40C7BDfFcE1f4DDB09fCEcf9F5B782be84":"Tier 1",
  "0x339A0603c00798a94d7152f78e071A31EF71bc32":"Tier 1",
  "0x247f5B47ED51B35f33f4B6c840B85754e43009cF": "Tier 2",
  "0xd560f7a9f56ecee05208ab1b721dc1a30babee1b":"Tier 1",
  "0x4d20cf5E15058Df3E06AA8732e96852337c55e56":"Tier 1",
  "0x311F76699848Ce7af639583d612D5E467CC88A39":"Tier 1",
  '0x9ce5de8a50534ced5b5709d76d703730c26e0164':"Tier 1",
  "0x9b7816f3eb2d35A24edD9BB4F33f05E9a2332494":"Tier 1",
  "0x90F11F27c9FbF7040BEB112cB30c8E5821382dEf":"Tier 1",
  "0x84018094A95257Ff6DF8945d397173bDBA49e323":"Tier 1",
  "0xfca6d13d641b571249a6221787da4209ae58e4a6": "Tier 2",
  "0x7567207Eb4422Ebc201a842AB21D6798404F184b": "Tier 2",
  "0x90F11F27c9FbF7040BEB112cB30c8E5821382dEf":"Tier 1"
}

  return (
    <div className="flex flex-col gap-6 mt-5 items-center">
      
      <div className="w-[1274px] py-2 px-3 rounded-[8px] bg-[#D9D9D9] text-start flex justify-between items-center">
        <span className="font-clash font-normal text-[18px] text-black">
         {eligibility === null
            ? "Whitelist Check"
            : eligibility.eligible
            ? `You are eligible (${eligibility.tier})`
            : "You are not eligible"}
        </span>
            <button 
            onClick={checkEligibility}
            className="bg-[#583FB7] w-fit py-2 px-3 text-center text-white
             font-clash font-normal text-[18px] rounded-[8px]">
            Check Eligibility
            </button>
      </div>

      {/* <input 
      placeholder="Enter wallet to check eligibility"
      onChange={(e)=>setCheckAddress(e.target.value)}
      className="w-[1274px] rounded-[8px] font-clash py-4 px-3 h-full bg-[#D9D9D9] font-normal text-[18px] leading-[100%] tracking-[0] text-start text-black
                 focus:ring-2 focus:ring-black focus:outline-none placeholder:text-black " /> */}

      <div className="w-[1274px]">
            <button 
            onClick={isConnected ? disconnectWallet : connectWallet}
            className="font-clash w-full py-4 px-3 rounded-[8px] bg-[#D9D9D9] font-normal text-[18px] leading-[100%] tracking-[0] text-black flex justify-between items-center">
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
