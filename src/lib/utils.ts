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
