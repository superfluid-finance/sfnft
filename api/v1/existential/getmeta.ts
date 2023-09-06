import { VercelResponse } from "@vercel/node";
import { getAddress } from "ethers/lib/utils";
import { networks } from "../../utils/NetworkUtils";
import { ExistentialNFTRequest } from "../../utils/RequestUtils";
import { fetchTokenData, getMonthlyEtherValue } from "../../utils/TokenUtils";
import { objectToQueryString } from "../../utils/URLUtil";
import { ExistentialNFTRequestQuerySchema } from "../../utils/ValidationUtils";
import { promiseWithTimeout } from "../../utils/ENSUtils";

const TIMEOUT = 9000;

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
      symbol: NFTSymbol,
      token,
      sender,
      recipient,
      flowrate,
    } = request.query;

    const productName = name.replace(/\+/g, " ");
    const productDescription = description.replace(/\+/g, " ");
    const tokenAddr = token as string;
    const monthlyFlowRate = getMonthlyEtherValue(flowrate as string);

    // best guess for testing, should be config provided for prod
    const baseURL = `${request.headers["X-Forwarded-Proto"] ?? "http"}://${
      request.headers.host
    }`;

    const imageUrl = `${baseURL}/api/v1/existential/getsvg?${objectToQueryString(
      request.query as Record<string, string>
    )}`;

    const streamUrl = `https://app.superfluid.finance/stream/${
      networks[Number(chain)].slug
    }/${sender}-${recipient}-${tokenAddr}`;

    const { symbol: tokenSymbol } = await promiseWithTimeout(
      fetchTokenData(tokenAddr.toLowerCase(), chain),
      TIMEOUT
    );

    const attributes = [
      { trait_type: "Product Name", value: productName },
      { trait_type: "Product Description", value: productDescription },
      { trait_type: "Sender", value: sender },
      { trait_type: "Receiver", value: recipient },
      { trait_type: "Token", value: tokenAddr },
      { trait_type: "Token Symbol", value: tokenSymbol },
      { trait_type: "Existential NFT Symbol", value: NFTSymbol },
      { trait_type: "Flow Rate", value: flowrate },
      { trait_type: "Monthly Flow Rate", value: monthlyFlowRate },
    ];

    response
      .status(200)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Content-Type", "application/json")
      .send(
        JSON.stringify({
          name: `Streamgating NFT - ${monthlyFlowRate} ${tokenSymbol} per month`,
          attributes,
          description: `This NFT represents a subscription to ${name} for ${monthlyFlowRate} ${tokenSymbol} per month. The subscription is managed by Superfluid and can be cancelled at any time. The subscription is paid by ${sender} and received by ${recipient}.
          **Sender:** ${getAddress(sender)}
          **Receiver:** ${getAddress(recipient)}
          **Amount:** ${monthlyFlowRate} per month
          **Token:** ${tokenSymbol}
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
