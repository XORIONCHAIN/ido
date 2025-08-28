// components/SelectCrypto.tsx

import { TOKEN_CONTRACTS } from "@/lib/networks";

interface SelectCryptoProps {
  setToken: (token: string) => void;
  toggleDropdown: () => void;
  selectedNetwork: 'ETH' | 'BSC';
}

const SelectCryptoComp = ({ setToken, toggleDropdown, selectedNetwork }: SelectCryptoProps) => {
  const availableTokens = Object.keys(TOKEN_CONTRACTS[selectedNetwork]);

  return (
    <div className="absolute text-gray-900 top-full left-0 w-full bg-white border border-gray-300 rounded-b-md shadow-lg z-10 max-h-60 overflow-y-auto">
      {availableTokens.map((tokenSymbol) => (
        <div
          key={tokenSymbol}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
          onClick={() => {
            setToken(tokenSymbol);
            toggleDropdown();
          }}
        >
          <img 
            src={`/tokens/${tokenSymbol.toLowerCase()}.svg`} 
            alt={tokenSymbol}
            className="w-6 h-6"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="font-medium">{tokenSymbol}</span>
        </div>
      ))}
    </div>
  );
};

export default SelectCryptoComp;