
type Props = {
  setToken: (token: string)=>void;
  toggleDropdown: () => void
}

const SelectCrypto = ({setToken, toggleDropdown}: Props) => {
  return (
    <div className="absolute top-full left-0 w-full bg-[#D9D9D9] rounded-b-[8px] shadow-md z-10 text-[#121212]">
        <div
        onClick={(e) => {
          setToken("USDC")
          toggleDropdown()

        }}
        className="flex items-center gap-2 py-3 px-4 hover:bg-gray-200 cursor-pointer">
            <img src="/usdc.svg" alt="USDC" className="w-5 h-5" />
            <span className="font-clash font-bold text-[15px]">USDC</span>
        </div>
        <div
         onClick={(e) => {
          setToken("USDT")
          toggleDropdown()
        }}
        className="flex items-center gap-2 py-3 px-4 hover:bg-gray-200 cursor-pointer">
            <img src="/usdt.svg" alt="USDT" className="w-5 h-5" />
            <span className="font-clash font-bold text-[15px]">USDT</span>
        </div>
    </div>
  )
}

export default SelectCrypto