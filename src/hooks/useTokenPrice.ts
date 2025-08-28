// hooks/useTokenPrices.ts
import { useState, useEffect } from 'react';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

export interface TokenPrice {
  usd: number;
  last_updated_at: number;
}

export interface TokenPrices {
  [tokenId: string]: TokenPrice;
}

export const TOKEN_IDS: { [symbol: string]: string } = {
  // Ethereum tokens
  'USDT': 'tether',
  'USDC': 'usd-coin',
  
  // Binance Smart Chain tokens
  'BNB': 'binancecoin',
};

export function useTokenPrices(tokens: string[], refreshInterval = 30000) {
  const [prices, setPrices] = useState<TokenPrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const APIS = [
    {
      name: 'CoinGecko',
      url: (tokenIds: string[]) => 
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(',')}&vs_currencies=usd&include_last_updated_at=true`
    },
    {
      name: 'Binance',
      url: (tokenIds: string[]) => 
        `https://api.binance.com/api/v3/ticker/price?symbols=${tokenIds.map(id => `${id}USDT`).join(',')}`
    }
  ];

  const fetchFromAPI = async (api: typeof APIS[0], tokenIds: string[]) => {
    try {
      const response = await fetch(api.url(tokenIds));
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const newPrices: TokenPrices = {};

      if (api.name === 'CoinGecko') {
        tokens.forEach(token => {
          const tokenId = TOKEN_IDS[token];
          if (tokenId && data[tokenId]) {
            newPrices[token] = {
              usd: data[tokenId].usd,
              last_updated_at: data[tokenId].last_updated_at
            };
          }
        });
      } else if (api.name === 'Binance') {
        // Binance-specific parsing
        tokens.forEach(token => {
          const symbol = `${token}USDT`;
          const priceData = Array.isArray(data) ? data.find((item: any) => item.symbol === symbol) : null;
          if (priceData) {
            newPrices[token] = {
              usd: parseFloat(priceData.price),
              last_updated_at: Date.now() / 1000
            };
          }
        });
      }

      return newPrices;
    } catch (error) {
      console.error(`Error fetching from ${api.name}:`, error);
      return null;
    }
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const tokenIds = tokens.map(token => TOKEN_IDS[token]).filter(Boolean);
      
      if (tokenIds.length === 0) {
        setLoading(false);
        return;
      }

      // Try APIs in sequence until one works
      for (const api of APIS) {
        try {
          const apiPrices = await fetchFromAPI(api, tokenIds);
          if (apiPrices && Object.keys(apiPrices).length > 0) {
            setPrices(apiPrices);
            setError(null);
            break;
          }
        } catch (err) {
          console.warn(`Failed to fetch from ${api.name}`, err);
        }
      }

    } catch (err) {
      console.error('Error fetching token prices:', err);
      setError('Failed to fetch prices from all APIs');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPrices();

    // Set up periodic refresh
    const interval = setInterval(fetchPrices, refreshInterval);
    return () => clearInterval(interval);
  }, [tokens.join(','), refreshInterval]);

  return { prices, loading, error, refreshPrices: fetchPrices };
}