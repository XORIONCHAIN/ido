
type Props = {
  handleNetworkChange: (network: 'ETH' | 'BSC')=>void;
  toggleDropdownNet: () => void
}

const SelectCryptoNet = ({handleNetworkChange, toggleDropdownNet}: Props) => {
  
  return (
    <div className="absolute top-full left-0 w-full bg-[#D9D9D9] rounded-b-[8px] shadow-md z-10 text-[#121212]">
        
        <div
        onClick={(e) => {
          handleNetworkChange("ETH")
          toggleDropdownNet()

        }}
        className="flex items-center gap-2 py-3 px-4 hover:bg-gray-200 cursor-pointer">
            <img src="/ethsvg.svg" alt="USDC" className="w-5 h-5" />
            <span className="font-clash font-bold text-[15px]">ETH</span>
        </div>

        <div
         onClick={(e) => {
          handleNetworkChange("BSC")
          toggleDropdownNet()
        }}
        className="flex items-center gap-2 py-3 px-4 hover:bg-gray-200 cursor-pointer">
            <img src="/bsc.png" alt="USDT" className="w-5 h-5" />
            <span className="font-clash font-bold text-[15px]">BSC</span>
        </div>

    </div>
  )



}

export default SelectCryptoNet