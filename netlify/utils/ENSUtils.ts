declare const Buffer;

import { ethers } from "ethers";
import fetch from "node-fetch";
import { getImageBase64Data } from "./ImageUtils";

export interface ENSAvatarData {
  type: string;
  data: string;
}

const mainnetProvider = new ethers.providers.JsonRpcProvider(
  {
    url: "https://rpc-endpoints.superfluid.dev/eth-mainnet",
    headers: {
      Origin: "https://app.superfluid.finance",
      Referer: "localhost",
    },
  },

  "mainnet"
);

export async function getENSName(address: string) {
  return mainnetProvider.lookupAddress(address).catch((e) => {
    return undefined;
  });
}

export async function getENSAvatar(address: string) {
  return mainnetProvider
    .getAvatar(address)
    .then((avatarUrl) => {
      if (!avatarUrl) return Promise.resolve(undefined);
      return getImageBase64Data(avatarUrl);
    })
    .catch(() => {
      return undefined;
    });
}

export function promiseWithTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutError = new Error("Promise timed out")
): Promise<T> {
  // create a promise that rejects in milliseconds
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(timeoutError);
    }, ms);
  });

  // returns a race between timeout and the passed promise
  return Promise.race<T>([promise, timeout]);
}
