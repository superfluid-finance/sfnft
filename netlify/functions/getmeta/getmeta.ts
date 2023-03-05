import { Event } from "@netlify/functions/dist/function/event";
import { format } from "date-fns";
import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { formatTraitDate } from "../../utils/DateUtils";
import { networks } from "../../utils/NetworkUtils";
import {
  fetchTokenData,
  fixBrokenFlowrate,
  getMonthlyEtherValue,
  TokenData,
} from "../../utils/TokenUtils";
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
      start_date,
    } = event.queryStringParameters;

    const tokenAddr = (token_address || token) as string;
    const tokenData = await fetchTokenData(tokenAddr.toLowerCase(), chain_id);
    const isListed = Boolean((tokenData as TokenData)?.isListed);
    const fixedFlowRate = fixBrokenFlowrate(flowRate, start_date);
    const monthlyFlowRate = getMonthlyEtherValue(fixedFlowRate);

    // best guess for testing, should be config provided for prod
    const baseURL = `https://${event.headers.host}`;
    const imageUrl = `${baseURL}/cfa/v1/getsvg?${event.rawQuery}`;
    const streamUrl = `https://app.superfluid.finance/stream/${networks[chain_id].slug}/${sender}-${receiver}-${tokenAddr}`;

    const startDateTrait = formatTraitDate(start_date);

    const attributes = [
      { trait_type: "Sender", value: sender },
      { trait_type: "Receiver", value: receiver },
      { trait_type: "Token", value: tokenAddr },
      { trait_type: "Token Symbol", value: token_symbol },
      { trait_type: "Listed", value: isListed.toString() },
      { trait_type: "Flow Rate", value: fixedFlowRate },
      { trait_type: "Monthly Flow Rate", value: monthlyFlowRate },
      ...(startDateTrait
        ? [{ trait_type: "Start Date", value: startDateTrait }]
        : []),
    ];

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Superfluid Stream - ${monthlyFlowRate} ${token_symbol} per month`,
        attributes,
        description: `${
          !isListed ? "**⚠️ Unlisted token, use with caution!**  \n\n" : ""
        }This NFT represents a ${
          streamUrl ? `[Superfluid Stream](${streamUrl})` : "Superfluid Stream"
        }.${"  "}
Manage your streams at ${
          streamUrl
            ? `[app.superfluid.finance](${streamUrl})`
            : "app.superfluid.finance"
        }.${"  "}

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
    return { statusCode: 400, body: error.toString() };
  }
};
