import {
  VercelRequest,
  VercelRequestQuery,
  VercelResponse,
} from "@vercel/node";
import { format } from "date-fns";
import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { formatTraitDate } from "../utils/DateUtils";
import { networks } from "../utils/NetworkUtils";
import {
  fixBrokenFlowrate,
  getMonthlyEtherValue,
  TokenData,
} from "../utils/TokenUtils";
import { NFTRequestQuerySchema } from "../utils/ValidationUtils";
import { objectToQueryString } from "../utils/URLUtil";
import { NFTRequest } from "../utils/RequestUtils";

export const handler = async (
  request: NFTRequest,
  response: VercelResponse
) => {
  try {
    await NFTRequestQuerySchema.validate(request.query);

    const {
      chain_id,
      sender,
      receiver,
      token_address,
      token,
      flowRate,
      token_symbol,
      start_date,
    } = request.query;

    const tokenAddr = (token_address || token) as string;
    // const tokenData = await fetchTokenData(tokenAddr.toLowerCase(), chain_id);
    const isListed = true;
    const fixedFlowRate = fixBrokenFlowrate(flowRate, start_date);
    const monthlyFlowRate = getMonthlyEtherValue(fixedFlowRate);

    // best guess for testing, should be config provided for prod
    const baseURL = `https://${request.headers.host}`;

    const imageUrl = `${baseURL}/cfa/v2/getsvg?${objectToQueryString(
      request.query
    )}`;

    const streamUrl = `https://app.superfluid.finance/stream/${
      networks[Number(chain_id)].slug
    }/${sender}-${receiver}-${tokenAddr}`;

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

    response
      .status(200)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Content-Type", "application/json")
      .send(
        JSON.stringify({
          name: `Superfluid Stream - ${monthlyFlowRate} ${token_symbol} per month`,
          attributes,
          description: `${
            !isListed ? "**⚠️ Unlisted token, use with caution!**  \n\n" : ""
          }This NFT represents a ${
            streamUrl
              ? `[Superfluid Stream](${streamUrl})`
              : "Superfluid Stream"
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
**Network:** ${networks[Number(chain_id)].name}`,
          external_url: streamUrl,
          image: imageUrl,
        })
      );
  } catch (error) {
    response.status(400).send(error);
  }
};

export default handler;
