import { useState } from "react"

type Props = {}

const SaleInfo = (props: Props) => {
    const [selectedTab, setSelectedTab] = useState('Introduction to Xorion Chain')
      const Toc = ['Introduction to Xorion Chain', 'Roadmap Highlights', 'Tokenomics', 'Team & Partners']

  return (
    <div className="flex flex-col gap-6 mt-5">
        
        <div className="flex justify-between">
            <span className="font-clash font-normal leading-[100%] tracking-[0] text-center w-fit">Token Name</span>
            <span className="font-clash font-bold text-[20px] leading-[100%] tracking-[0] text-center">Xorion Token</span>
        </div>
        <div className="flex justify-between">
            <span>Token Symbol</span>
            <span className="font-clash font-bold text-20px] leading-[100%] tracking-[0] text-center">XOR</span>
        </div>
        <div className="flex justify-between">
            <span>Network</span>
            <span className="font-clash font-bold text-[20px] leading-[100%] tracking-[0] text-center">Polkadot Substrate</span>
        </div>
        <div className="flex justify-between">
            <span>Allocation</span>
            <span className="font-clash font-bold text-[20px] leading-[100%] tracking-[0] text-center">10,000,000</span>
        </div>
        <div className="flex justify-between">
            <span>Price</span>
            <span className="font-clash font-bold text-[20px] leading-[100%] tracking-[0] text-center">$0.05</span>
        </div>
        <div className="flex justify-between">
            <span>Accepted Currencies</span>
            <div className="font-clash font-bold text-[20px] leading-[100%] tracking-[0] text-center flex gap-1 items-center">
                <span className="flex gap-1 items-center">
                    <img src="/ethsvg.svg" alt="" className="w-4 h-4"/>
                    ETH,
                </span>
                <span className="flex gap-1 items-center">
                    <img src="/usdt.svg" alt="" className="w-4 h-4"/>
                    USDT,
                </span>
                <span className="flex gap-1 items-center">
                    <img src="/usdc.svg" alt="" className="w-4 h-4"/>
                    USDC
                </span>
            </div>
        </div>
        <div className="flex justify-between">
            <span>Vesting</span>
            <span className="font-clash font-bold text-[20px] leading-[100%] tracking-[0] text-center">50% Unlocked, 50% VESTING 6 MONTHS</span>
        </div>
        <div className="flex justify-between">
            <span>TGE</span>
            <span className="font-clash font-bold text-[20px] leading-[100%] tracking-[0] text-center">31st August 2025</span>
        </div>

    </div>
  )
}

export default SaleInfo