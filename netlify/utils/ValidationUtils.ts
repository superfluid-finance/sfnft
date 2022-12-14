import { isAddress } from "ethers/lib/utils";
import { object, string } from "yup";
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
      is: (token) => !token || token.length === 0,
      then: string()
        .required()
        .test(...AddressTest),
    }),
    token: string().when("token_address", {
      is: (token) => !token || token.length === 0,
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
  },
  [["token_address", "token"]]
);
