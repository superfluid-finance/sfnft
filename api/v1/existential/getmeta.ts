import { VercelResponse } from "@vercel/node";
import { getAddress } from "ethers/lib/utils";
import { formatTraitDate } from "../../utils/DateUtils";
import { networks } from "../../utils/NetworkUtils";
import { ExistentialNFTRequest } from "../../utils/RequestUtils";
import { getMonthlyEtherValue } from "../../utils/TokenUtils";
import { objectToQueryString } from "../../utils/URLUtil";
import { ExistentialNFTRequestQuerySchema } from "../../utils/ValidationUtils";

export const handler = async (
  request: ExistentialNFTRequest,
  response: VercelResponse
) => {
  try {
    await ExistentialNFTRequestQuerySchema.validate(request.query);

    const {
      name,
      description,
      chain,
      symbol,
      token,
      sender,
      recipient,
      flowrate,
    } = request.query;

    const tokenAddr = token;
    const isListed = true;
    const monthlyFlowRate = getMonthlyEtherValue(flowrate as string);

    // best guess for testing, should be config provided for prod
    const baseURL = `https://${request.headers.host}`;

    const imageUrl = `${baseURL}/existential/v1/getsvg?${objectToQueryString(
      request.query as Record<string, string>
    )}`;

    const streamUrl = `https://app.superfluid.finance/stream/${
      networks[Number(chain)].slug
    }/${sender}-${recipient}-${tokenAddr}`;

    const attributes = [
      { trait_type: "Product Name", value: name },
      { trait_type: "Product Description", value: description },
      { trait_type: "Sender", value: sender },
      { trait_type: "Receiver", value: recipient },
      { trait_type: "Token", value: tokenAddr },
      { trait_type: "Token Symbol", value: symbol },
      { trait_type: "Flow Rate", value: flowrate },
      { trait_type: "Monthly Flow Rate", value: monthlyFlowRate },
    ];

    response
      .status(200)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Content-Type", "application/json")
      .send(
        JSON.stringify({
          name: `Streamgating NFT - ${monthlyFlowRate} ${symbol} per month`,
          attributes,
          description: `This NFT represents a subscription to ${name} for ${monthlyFlowRate} ${symbol} per month. The subscription is managed by Superfluid and can be cancelled at any time. The subscription is paid by ${sender} and received by ${recipient}.
**Sender:** ${getAddress(sender)}${"  "}
**Receiver:** ${getAddress(recipient)}${"  "}
**Amount:** ${monthlyFlowRate} per month${"  "}
**Token:** ${symbol}${"  "}
**Network:** ${networks[Number(chain)].name}`,
          external_url: streamUrl,
          image: imageUrl,
        })
      );
  } catch (error) {
    response.status(400).send(error);
  }
};

export default handler;
