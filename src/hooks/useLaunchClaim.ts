import { useEffect, useState, useCallback } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { isAddress } from "ethers";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

declare global {
  interface Window {
    injectedWeb3?: any;
  }
}

type LaunchClaimState = {
  api: ApiPromise | null;
  isReady: boolean;
  account: string | null;
  contribution: string | null;
  error: string | null;
  claimTokens: () => Promise<void>;
};

function isValidSubstrateAddress(address: string): boolean {
  try {
    encodeAddress(decodeAddress(address));
    return true;
  } catch {
    return false;
  }
}

export function useLaunchClaim( account: string | null, endpoint: string) {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [contribution, setContribution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Connect to chain
  useEffect(() => {
    let provider: WsProvider | null = null;
    let localApi: ApiPromise | null = null;

    async function connect() {
      try {
        provider = new WsProvider(endpoint);
        localApi = await ApiPromise.create({ provider });
        await localApi.isReady;
        setApi(localApi);
        setIsReady(true);
      } catch (err: any) {
        setError(err.message || "Failed to connect");
      }
    }

    connect();

    return () => {
      if (localApi) {
        localApi.disconnect();
      }
    };
  }, [endpoint]);

  // 2. Subscribe to contribution
  useEffect(() => {
    let unsub: (() => void) | undefined;

    async function subscribe() {
      if (!api || !isReady || !account) return;

     if (!account || !isAddress(account)) {
  setContribution(null);
  return;
}


      try {
        unsub = await api.query.launchClaim.claims(account, (result) => {
          if (result.isNone) {
            setContribution(null);
          } else {
            setContribution(result.toHuman() as string);
          }
        });
      } catch (err: any) {
        setError(err.message || "Subscription failed");
      }
    }

    subscribe();

    return () => {
      if (unsub) unsub();
    };
  }, [api, isReady, account]);

  // 3. Claim tokens extrinsic
  const claimTokens = useCallback(async () => {
    if (!api || !isReady || !account) {
      setError("API not ready or account missing");
      return;
    }

    try {
      // Ask for wallet access
      const extensions = await web3Enable("Xorion IDO");
      if (extensions.length === 0) {
        setError("No extension found");
        return;
      }

      const injector = await web3FromAddress(account);

      await api.tx.launchClaim
        .claim() // call claim() from pallet
        .signAndSend(account, { signer: injector.signer }, ({ status, dispatchError }) => {
          if (dispatchError) {
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              const { documentation, name, section } = decoded;
              setError(`${section}.${name}: ${documentation.join(" ")}`);
            } else {
              setError(dispatchError.toString());
            }
          } else if (status.isInBlock) {
            console.log("Claim transaction included in block:", status.asInBlock.toString());
          } else if (status.isFinalized) {
            console.log("Claim finalized:", status.asFinalized.toString());
          }
        });
    } catch (err: any) {
      setError(err.message || "Claim transaction failed");
    }
  }, [api, isReady, account]);

  return { api, isReady, account, contribution, error, claimTokens };
}
