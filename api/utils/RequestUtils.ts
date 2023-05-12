import { VercelRequest, VercelRequestQuery } from "@vercel/node";

type NFTQuery = {
  chain_id: string;
  token_symbol: string;
  sender: string;
  receiver: string;
  flowRate: string;
  token_address: string | undefined;
  token: string | undefined;
  start_date: string | undefined;
  token_decimals: string | undefined;
  incoming: string | undefined;
} & VercelRequestQuery;

export type NFTRequest = VercelRequest & {
  query: NFTQuery;
};
