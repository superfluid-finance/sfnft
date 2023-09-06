import { isAddress } from "ethers/lib/utils";
import yup, { boolean, object, string } from "yup";
import { networks } from "./NetworkUtils";

const AddressTest = [
  "validate-address",
  "Not a valid address",
  (value: any) => isAddress(value),
] as const;

const ChainTest = [
  "validate-chain",
  "Not valid or supported chain",
  (value: any) => Object.keys(networks).includes(value),
] as const;

export const NFTRequestQuerySchema = object().shape(
  {
    token_address: string().when("token", {
      is: (token: string) => !token || token.length === 0,
      then: string()
        .required()
        .test(...AddressTest),
    }),
    token: string().when("token_address", {
      is: (token: string) => !token || token.length === 0,
      then: string()
        .required()
        .test(...AddressTest),
    }),
    sender: string()
      .test(...AddressTest)
      .required(),
    receiver: string()
      .test(...AddressTest)
      .required(),
    chain_id: string()
      .test(...ChainTest)
      .required(),
    token_symbol: string().required(),
    flowRate: string().required(),
    start_date: string().optional(),
    token_decimals: string().optional(),
    incoming: boolean().optional(),
  },
  [["token_address", "token"]]
);

export const ExistentialNFTRequestQuerySchema = object().shape({
  name: string().required(),
  description: string().required(),
  chain: string()
    .test(...ChainTest)
    .required(),
  ipfs: string().optional(),
  symbol: string().required(),
  token: string().required(),
  sender: string()
    .test(...AddressTest)
    .required(),
  recipient: string()
    .test(...AddressTest)
    .required(),

  flowrate: string().required(),
  clone: string().optional(),
});
