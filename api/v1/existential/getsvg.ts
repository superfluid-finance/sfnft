import { VercelResponse } from "@vercel/node";
import { ValidationError } from "yup";

import { promiseWithTimeout } from "../../utils/ENSUtils";
import { ExistentialNFTRequest, NFTRequest } from "../../utils/RequestUtils";
import { fetchTokenData, getMonthlyEtherValue } from "../../utils/TokenUtils";
import { ExistentialNFTRequestQuerySchema } from "../../utils/ValidationUtils";
import { getDefaultExistentialNFTSvg } from "../../assets/ExistentialNFTSvg";

const TIMEOUT = 9000;

export const handler = async (
  request: ExistentialNFTRequest,
  response: VercelResponse
) => {
  try {
    await ExistentialNFTRequestQuerySchema.validate(request.query);

    const {
      name: productName,
      chain,
      symbol: NFTSymbol,
      token,
      flowrate,
    } = request.query;

    const tokenAddr = token as string;
    const monthlyFlowRate = getMonthlyEtherValue(flowrate);

    const { symbol: tokenSymbol } = await promiseWithTimeout(
      fetchTokenData(tokenAddr.toLowerCase(), chain),
      TIMEOUT
    );

    const svgString = getDefaultExistentialNFTSvg({
      productName,
      tokenSymbol,
      flowRate: monthlyFlowRate,
      NFTSymbol,
    });

    response
      .status(200)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Content-Type", "image/svg+xml")
      .send(svgString);
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: error.errors,
          field: error.path,
        }),
      };
    }
    response.status(400).send(error);
  }
};

export default handler;
