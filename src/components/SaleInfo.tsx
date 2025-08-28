import { useState } from "react"

type Props = {}

const SaleInfo = (props: Props) => {
    const [selectedTab, setSelectedTab] = useState('Introduction to Xorion Chain')
      const Toc = ['Introduction to Xorion Chain', 'Roadmap Highlights', 'Tokenomics', 'Team & Partners']

  return (
    <div className="flex flex-col gap-6 mt-5 px-2 md:px-5 xl:px-10 pb-10">
        
        <div className="flex justify-between items-center">
            <span className="font-clash font-normal leading-[100%] tracking-[0] text-center w-fit">Token Name</span>
            <span className="font-clash font-bold lg:text-[20px] leading-[100%] tracking-[0] text-center">Xorion Token</span>
        </div>
        <div className="flex justify-between items-center">
            <span>Token Symbol</span>
            <span className="font-clash font-bold lg:text-[20px] leading-[100%] tracking-[0] text-center">XOR</span>
        </div>
        <div className="flex justify-between items-center">
            <span>Network</span>
            <span className="font-clash font-bold lg:text-[20px] leading-[100%] tracking-[0] text-center">Polkadot Substrate</span>
        </div>
        <div className="flex justify-between items-center">
            <span>Allocation</span>
            <span className="font-clash font-bold lg:text-[20px] leading-[100%] tracking-[0] text-center">10,000,000</span>
        </div>
        <div className="flex justify-between items-center">
            <span>Price</span>
            <span className="font-clash font-bold lg:text-[20px] leading-[100%] tracking-[0] text-center">$0.05</span>
        </div>
        <div className="flex justify-between items-center">
            <span>Accepted Currencies</span>
            <div className="font-clash font-bold text-[15px] lg:text-[20px] leading-[100%] tracking-[0] text-center flex gap-1 items-center">
                <span className="flex gap-1 items-center">
                    <img src="/usdt.svg" alt="" className="w-3 h-3 md:w-4 md:h-4"/>
                    USDT,
                </span>
                <span className="flex gap-1 items-center ">
                    <img src="/usdc.svg" alt="" className="w-3 h-3 md:w-4 md:h-4"/>
                    USDC
                </span>
            </div>
        </div>
        <div className="flex justify-between items-center">
            <span>Vesting</span>
            <span className="font-clash font-bold text-[14px] lg:text-[20px] leading-[100%] tracking-[0] md:text-center text-wrap text-right md:text-nowrap ">50% Unlocked, 50% VESTING 6 MONTHS</span>
        </div>
        <div className="flex justify-between items-center">
            <span>TGE</span>
            <span className="font-clash font-bold lg:text-[20px] leading-[100%] tracking-[0] text-center">31st August 2025</span>
        </div>

    </div>
  )
}

export default SaleInfo