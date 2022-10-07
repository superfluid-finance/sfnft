export interface NFTRequestEvent extends Event {
  queryStringParameters: {
    chain_id?: string;
    token_address?: string;
    token_symbol?: string;
    token_decimals?: string;
    sender?: string;
    receiver?: string;
    flowRate?: string;
    start_date?: string;
  };
}
