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
  "0x1DC19aD4afec00B69b4e6e695401db42Ab384472":"Tier 1",
  "0x2f3a2c092cdc931d03fcd7200584d33ccc1be1a1": "Tier 1",
  "0xe94Ec19F5e9F1B98dbBB395973175CFaFBb9FaC3": "Tier 1",
  "0x6EA2D1A2a28e5e4Cc86C62fFabf860C5f93EE37C": "Tier 1",
  "0xDDC930fdA0bE3720d95e062D51d50668De295527": "Tier 1",
  "0xCb7702b3C54724CdD1419a2A0C9a3625d00aE98e": "Tier 1",
  "0x9006F67736f9633D8ac4c87FafFd224f3c56b27A": "Tier 1",
  "0xA29b9c15933462f8dc0DbC66D1683F0cB23bD461": "Tier 1",
  "0x601acdc174892fB4c95067f9d50272F2A2905d1E": "Tier 1",
  "5Gs6MvUk6hVc1ZQFvv6NMfV6khH7xBpqWbGVX64UHppjjNwW": "Tier 1",
  "0x43d41df1d9859c9bdf947b7cbe8fc9c4a5ab4249": "Tier 1",
  "0xa4B51FE3A7B9656411478CB0a8adEB9F1AD17654": "Tier 1",
  "0x7c88c1296F6CfC8b5b8102AEd241B347e31c5611": "Tier 1",
  "0xdA6EAc44D723cD3fa98435d3Dcb18060ab063089": "Tier 1",
  "0x4b429aabd9899503c20b8106176f67a49a78c3e3": "Tier 1",
  "0x1633Ac68EffEF25660e5489B33BB95bC168b7fBE": "Tier 1",
  "0x1bFc2CA08Ca66A14418B9fB2f7a9A0e37BCE1F40": "Tier 1",
  "0x63413f51AC304102F252459796E686caB4A1714c": "Tier 1",
  "0x15048A5E8AF0A4F46566FBb95c5B1AC89754358e": "Tier 1",
  "0x37d4f3EC1f1127B25807978D5e9b4d7094e91846": "Tier 1",
  "0xd9c4501f9c788c3da76d690d88359f4abf0732f3": "Tier 1",
  "0xC25BD85f9f8C0fd6356D273f495B50c340654925": "Tier 1",
  "3zeR54REMyJDK24wnrg6C9CqKsutjysXbsd7pujqnTXt": "Tier 1",
  "0x003e640e2d54c0142ee8b83faf7e529db98df592": "Tier 1",
  "0x8bcbDC64212DEce8c3996D45edC88AD11170c55f": "Tier 1",
  "0x4ab64f57d55ED64f845A8D6225ADBcEc6C9404Aa": "Tier 1",
  "0xd0033cA3CbA3e5D04F9c4835016e87cd087ceDbb": "Tier 1",
  "0x8c5165c5a4936071c5504367Db42757927c5E815": "Tier 1",
  "0x0d52cD2D288E6E6CF47b165a3D8B6F819207B563": "Tier 1",
  '0x6046E5541bc5b2DDeC2A4f857670A8318e2934b1': "Tier 1",
  '0x00533B6742fE74374ad95cF581b126AAcd6f1C42': "Tier 1",
  '0x122FD8D2B9B3aA64C014c35C9986b1bAEcAC7f64': "Tier 1",
  '0x239d7C0d78035860E5464a0e67F1CAd24f394B13': "Tier 1",
   '0x155bfE4b744ddF65A046618eBc4366e633f53d8A': "Tier 1",
  '0x22695c3cb7b0aBD3cC6569A813fE7bC3E6fEF3C8': "Tier 1",
  '0x0AE48094447E8BF9E75DffCb9AfdeE778485330a': "Tier 1",
  '0xa1a506881748e822bd016362da3f4734e7e12638': "Tier 1",
  '0x72fBDcB64b8e17a99Dda1bb077D3661b7047Bf99': "Tier 1",
  '0x3f6229A83Fcdb69119Ed93a54E748eD89A86c64A': "Tier 1",
  '0x8D749418a36AD98f5611e67D1DA1fB8ae87C5633': "Tier 1",
  '0xe4aaea0add0188f22fa5e854d222ad7946899cc6': "Tier 1",
  '0x38Da8Cc9F732b3D8D62C61B4FDdEe5687858D8Bd': "Tier 1",
  '0x3C1c4E1b2644D896D25dFa0961db17Eb901f512A': "Tier 1",
  '0xc540b844AE51f50B5e5647B1cC33d2f9861640e5': "Tier 1",
  '0x1a021edf3d8a4d6Fc63023Dd7c22B0961EBF2239': "Tier 1",
  '0xf60ECdD43B0aB5e73a1000d8243E675223f62175': "Tier 1",
  '0xC13c36bFfD69aD8042Af02f536C6B3A911cfc0f3': "Tier 1",
  '0xB264d76fA9e0930C8321D36da19B551a7836d4A4': "Tier 1",
  '0x5Dc2e00Dc0Da4eF8aB5e8478ff122A99f2D4345C': "Tier 1",
  '0x1570538bd863cda432ccb4bfc50bd77af853f1ec': "Tier 1",
  '5GTtAzakru3gaDMGFDBnvuyX3P8VRx48qkB8eQ7jd2NyTPjF': "Tier 1",


}