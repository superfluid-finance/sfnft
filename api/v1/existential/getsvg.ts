import { VercelResponse } from "@vercel/node";
import { ValidationError } from "yup";

import { promiseWithTimeout } from "../../utils/ENSUtils";
import { ExistentialNFTRequest } from "../../utils/RequestUtils";
import { fetchTokenData, getMonthlyEtherValue } from "../../utils/TokenUtils";
import { ExistentialNFTRequestQuerySchema } from "../../utils/ValidationUtils";
import {
  getDefaultExistentialNFTSvg,
  getExistentialNFTSvg,
} from "../../assets/ExistentialNFTSvg";
import { getImageBase64Data } from "../../utils/ImageUtils";

const TIMEOUT = 9000;

export const handler = async (
  request: ExistentialNFTRequest,
  response: VercelResponse
) => {
  try {
    await ExistentialNFTRequestQuerySchema.validate(request.query);

    const {
      name,
      chain,
      symbol: NFTSymbol,
      token,
      flowrate,
      ipfs,
    } = request.query;

    const productName = name.replace(/\+/g, " ");
    const tokenAddr = token as string;
    const monthlyFlowRate = Number(getMonthlyEtherValue(flowrate)).toFixed(2);

    const { symbol: tokenSymbol } = await promiseWithTimeout(
      fetchTokenData(tokenAddr.toLowerCase(), chain),
      TIMEOUT
    );

    const svgString = !ipfs
      ? getDefaultExistentialNFTSvg({
          productName,
          tokenSymbol,
          flowRate: monthlyFlowRate,
          NFTSymbol,
        })
      : getExistentialNFTSvg({
          USER_IMG_Base64: await getImageBase64Data(
            `https://cloudflare-ipfs.com/ipfs/${ipfs}`
          ),
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
