declare const Buffer;

import { ethers } from "ethers";
import fetch from "node-fetch";

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

export async function getENSData(sender: string, receiver: string) {
  return promiseWithTimeout(
    Promise.allSettled([
      getENSName(sender),
      getENSName(receiver),
      getENSAvatar(sender),
      getENSAvatar(receiver),
    ]).then((promiseResults) =>
      promiseResults.map((promiseResult) => {
        if (promiseResult.status === "fulfilled") {
          return promiseResult.value;
        }
        return undefined;
      })
    ),
    9000
  );
}

export async function getENSName(address: string) {
  return mainnetProvider.lookupAddress(address).catch((e) => {
    return undefined;
  });
}

export async function getENSAvatar(address: string) {
  return mainnetProvider
    .getAvatar(address)
    .then((avatarUrl) => {
      console.log("Avatar url", avatarUrl);
      if (!avatarUrl) return Promise.resolve(undefined);

      return fetch(avatarUrl).then((response) =>
        response
          .arrayBuffer()
          .then(
            (buffer) =>
              `data:image/${response.headers.get("content-type")};base64,` +
              Buffer.from(buffer).toString("base64")
          )
      );
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
