import { NetworkSlugs } from "../../utils/NetworkUtils";
import { Event } from "@netlify/functions/dist/function/event";
import { NFTRequestQuerySchema } from "../../utils/ValidationUtils";

export interface NFTRequestEvent extends Event {
  queryStringParameters: {
    chain_id: string;
    token_address: string;
    token_symbol: string;
    sender: string;
    receiver: string;
    flowRate: string;
    start_date?: string;
    token_decimals?: string;
  };
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
export const handler = async (event: NFTRequestEvent) => {
  try {
    await NFTRequestQuerySchema.validate(event.queryStringParameters);

    const { chain_id, sender, receiver, token_address } =
      event.queryStringParameters;

    // best guess for testing, should be config provided for prod
    const baseURL = `https://${event.headers.host}`;
    const imageUrl = `${baseURL}/.netlify/functions/getsvg?${event.rawQuery}`;
    const streamUrl = `https://app.superfluid.finance/stream/${NetworkSlugs[chain_id]}/${sender}-${receiver}-${token_address}`;

    return {
      statusCode: 200,
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
