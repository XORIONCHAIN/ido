import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type BN from 'bn.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a raw tXOR balance (plancks, 1 tXOR = 1e18 plancks) to a human-readable string.
 * @param balanceRaw string | number | BN - the raw balance in plancks
 * @param decimals number - number of decimals (default 18)
 * @param maxFractionDigits number - max decimals to show (default 4)
 * @returns string - formatted tXOR balance
 */
export function formatTxor(balanceRaw: string | number | BN, decimals = 18, maxFractionDigits = 4): string {
  if (balanceRaw == null) return '0.0000';
  let num: number;
  if (typeof balanceRaw === 'string') {
    // Remove commas and spaces
    const clean = balanceRaw.replace(/[,\s]/g, '');
    num = parseFloat(clean);
  } else if (typeof balanceRaw === 'object' && 'toString' in balanceRaw) {
    // BN.js support
    num = parseFloat(balanceRaw.toString());
  } else {
    num = Number(balanceRaw);
  }
  if (!isFinite(num) || num === 0) return '0.0000';
  const divisor = Math.pow(10, decimals);
  const display = num / divisor;
  return display.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: maxFractionDigits });
}


export const switchEthereumNetwork = async () => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not found");

    // Try switching to Ethereum Mainnet
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }], // Ethereum Mainnet
    });
  } catch (error: any) {
    // If Ethereum Mainnet isn't added, request to add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x1",
              chainName: "Ethereum Mainnet",
              rpcUrls: ["https://mainnet.infura.io/v3/"], // You can replace with your RPC
              blockExplorerUrls: ["https://etherscan.io"],
              nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        });
      } catch (addError) {
        console.error("Error adding Ethereum Mainnet:", addError);
      }
    } else {
      console.error("Error switching network:", error);
    }
  }
};
