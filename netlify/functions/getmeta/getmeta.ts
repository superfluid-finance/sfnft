import { DashboardNetworkSlugs } from "../../utils/NetworkUtils";
import { Event } from "@netlify/functions/dist/function/event";

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

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
export const handler = async (event: NFTRequestEvent) => {
  try {
    const { chain_id, sender, receiver, token_address } =
      event.queryStringParameters;
    // best guess for testing, should be config provided for prod
    const baseURL = `https://${event.headers.host}`;
    const imageUrl = `${baseURL}/cfa/v1/getsvg?${event.rawQuery}`;

    const streamUrl = getStreamUrl(chain_id, sender, receiver, token_address);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Superfluid Stream`,
        description: `This NFT represents a ${
          streamUrl
            ? `[Superfluid Constant Flow](${streamUrl})`
            : "Superfluid Constant Flow"
        }.`,
        external_url: streamUrl,
        image: imageUrl,
      }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

function getStreamUrl(
  chainId?: string,
  sender?: string,
  receiver?: string,
  tokenAddress?: string
) {
  if (!chainId || !sender || !receiver || !tokenAddress) return undefined;
  const networkSlug = DashboardNetworkSlugs[chainId];
  if (!networkSlug) return undefined;

  return `https://app.superfluid.finance/stream/${networkSlug}/${sender}-${receiver}-${tokenAddress}`;
}
