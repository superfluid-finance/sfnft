import { NetworkNames, NetworkSlugs } from "../../utils/NetworkUtils";
import { Event } from "@netlify/functions/dist/function/event";
import { NFTRequestQuerySchema } from "../../utils/ValidationUtils";
import {
  getPrettyEtherFlowRate,
  timeUnitWordMap,
} from "../../utils/TokenUtils";
import { getAddress } from "ethers/lib/utils";

export interface NFTRequestEvent extends Event {
  queryStringParameters: {
    chain_id: string;
    token_address: string;
    token_symbol: string;
    sender: string;
    receiver: string;
    flowRate: string;
    start_date: string | undefined;
    token_decimals: string | undefined;
  };
}

export interface NFTRequestQuery {
  chain_id: string;
  token_address: string;
  token_symbol: string;
  sender: string;
  receiver: string;
  flowRate: string;
  start_date: string | undefined;
  token_decimals: string | undefined;
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
      flowRate,
      token_symbol,
    } = event.queryStringParameters;

    const prettyFlowRate = getPrettyEtherFlowRate(flowRate || "0");

    // best guess for testing, should be config provided for prod
    const baseURL = `https://${event.headers.host}`;
    const imageUrl = `${baseURL}/cfa/v1/getsvg?${event.rawQuery}`;
    const streamUrl = `https://app.superfluid.finance/stream/${NetworkSlugs[chain_id]}/${sender}-${receiver}-${token_address}`;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Superfluid Stream - ${
          prettyFlowRate.amountEther
        } ${token_symbol} per ${timeUnitWordMap[prettyFlowRate.unitOfTime]}`,
        description: `This NFT represents a ${
          streamUrl ? `[Superfluid Stream](${streamUrl})` : "Superfluid Stream"
        }.${"  "}
Manage your streams at ${
          streamUrl
            ? `[app.superfluid.finance](${streamUrl})`
            : "app.superfluid.finance"
        }.${"  "}

**Sender:** ${getAddress(sender)}${"  "}
**Receiver:** ${getAddress(receiver)}${"  "}
**Amount:** ${prettyFlowRate.amountEther} per ${
          timeUnitWordMap[prettyFlowRate.unitOfTime]
        }${"  "}
**Token:** ${token_symbol}${"  "}
**Network:** ${NetworkNames[chain_id]}
`,
        external_url: streamUrl,
        image: imageUrl,
      }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
