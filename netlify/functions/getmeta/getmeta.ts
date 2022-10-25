import { Event } from "@netlify/functions/dist/function/event";
import { getAddress } from "ethers/lib/utils";
import { networks } from "../../utils/NetworkUtils";
import { fetchTokenData, getMonthlyEtherValue } from "../../utils/TokenUtils";
import { NFTRequestQuerySchema } from "../../utils/ValidationUtils";

export interface NFTRequestEvent extends Event {
  queryStringParameters: {
    chain_id: string;
    token_symbol: string;
    sender: string;
    receiver: string;
    flowRate: string;
    token_address: string | undefined;
    token: string | undefined;
    start_date: string | undefined;
    token_decimals: string | undefined;
  };
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
export const handler = async (event: NFTRequestEvent) => {
  try {
    await NFTRequestQuerySchema.validate(event.queryStringParameters);

    const {
      chain_id,
      sender,
      receiver,
      token_address,
      token,
      flowRate,
      token_symbol,
    } = event.queryStringParameters;

    const tokenAddr = (token_address || token) as string;
    const tokenData = await fetchTokenData(tokenAddr, chain_id);
    const isListed = tokenData && tokenData.isListed;
    const monthlyFlowRate = getMonthlyEtherValue(flowRate);

    // best guess for testing, should be config provided for prod
    const baseURL = `https://${event.headers.host}`;
    const imageUrl = `${baseURL}/cfa/v1/getsvg?${event.rawQuery}`;
    const streamUrl = `https://app.superfluid.finance/stream/${networks[chain_id].slug}/${sender}-${receiver}-${tokenAddr}`;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Superfluid Stream - ${monthlyFlowRate} ${token_symbol} per month`,
        description: `This NFT represents a ${
          streamUrl ? `[Superfluid Stream](${streamUrl})` : "Superfluid Stream"
        }.${"  "}
Manage your streams at ${
          streamUrl
            ? `[app.superfluid.finance](${streamUrl})`
            : "app.superfluid.finance"
        }.${!isListed ? "  \n\n**This token is not listed!**  \n" : "  "}
**Sender:** ${getAddress(sender)}${"  "}
**Receiver:** ${getAddress(receiver)}${"  "}
**Amount:** ${monthlyFlowRate} per month${"  "}
**Token:** ${token_symbol}${"  "}
**Network:** ${networks[chain_id].name}`,
        external_url: streamUrl,
        image: imageUrl,
      }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
