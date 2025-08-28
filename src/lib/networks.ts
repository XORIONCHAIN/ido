// networks.js or add to your existing utils file
export const NETWORKS = {
  ETH: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 6 },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io/']
  },
  BSC: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/']
  }
};

export const TOKEN_CONTRACTS = {
  ETH: {
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  },
  BSC: {
    USDT: "0x55d398326f99059fF775485246999027B3197955",
    BNB: "0x0000000000000000000000000000000000000000" // Native token
  }
};

export const IDO_CONTRACTS = {
  ETH: "0xd3f35ee0274369Dc6d99B0eD292f8f74bbAA8827",
  BSC: "0x49E853565247800E391B54859bB7e8fE293Cc464" // Replace with actual BSC IDO contract
};