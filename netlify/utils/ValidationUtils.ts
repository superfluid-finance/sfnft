import { isAddress } from "ethers/lib/utils";
import { number, object, string } from "yup";
import { DashboardNetworkSlugs } from "./NetworkUtils";

const AddressTest = [
  "validate-address",
  "Not a valid address",
  (value: any) => isAddress(value),
] as const;

const ChainTest = [
  "validate-chain",
  "Not valid or supported chain",
  (value: any) => Object.keys(DashboardNetworkSlugs).includes(value),
] as const;

export const NFTRequestQuerySchema = object().shape({
  token_address: string()
    .test(...AddressTest)
    .required(),
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
});
