import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type BN from 'bn.js';
import { NETWORKS } from "./networks";

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


// export const switchEthereumNetwork = async () => {
//   try {
//     if (!window.ethereum) throw new Error("MetaMask not found");

//     // Try switching to Ethereum Mainnet
//     await window.ethereum.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: "0x1" }], // Ethereum Mainnet
//     });
//   } catch (error: any) {
//     // If Ethereum Mainnet isn't added, request to add it
//     if (error.code === 4902) {
//       try {
//         await window.ethereum.request({
//           method: "wallet_addEthereumChain",
//           params: [
//             {
//               chainId: "0x1",
//               chainName: "Ethereum Mainnet",
//               rpcUrls: ["https://mainnet.infura.io/v3/"], // You can replace with your RPC
//               blockExplorerUrls: ["https://etherscan.io"],
//               nativeCurrency: {
//                 name: "Ether",
//                 symbol: "ETH",
//                 decimals: 18,
//               },
//             },
//           ],
//         });
//       } catch (addError) {
//         console.error("Error adding Ethereum Mainnet:", addError);
//       }
//     } else {
//       console.error("Error switching network:", error);
//     }
//   }
// };


// utils.ts - Add BSC support to switchEthereumNetwork


// utils.ts - Add BSC support to switchEthereumNetwork


export const switchEthereumNetwork = async (network: 'ETH' | 'BSC' = 'ETH') => {
  const networkConfig = NETWORKS[network];
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
    } else {
      throw switchError;
    }
  }
};


export const wl = {
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