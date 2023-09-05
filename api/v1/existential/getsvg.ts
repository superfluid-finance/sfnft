import { VercelResponse } from "@vercel/node";
import { ValidationError } from "yup";
import { getNFTSVG } from "../../assets/NFTSvg";
import Blockie from "../../utils/Blockie";
import { promiseWithTimeout } from "../../utils/ENSUtils";
import { ExistentialNFTRequest, NFTRequest } from "../../utils/RequestUtils";
import { getTokenSymbolBlockX, shortenHex } from "../../utils/StringUtils";
import {
  TokenData,
  fetchTokenData,
  fetchTokenIconData,
  getMonthlyEtherValue,
  getPrettyEtherFlowRate,
} from "../../utils/TokenUtils";
import { ExistentialNFTRequestQuerySchema } from "../../utils/ValidationUtils";

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
      symbol,
      token,
      sender,
      recipient,
      flowrate,
    } = request.query;

    const tokenAddr = token as string;
    const prettyFlowRate = getPrettyEtherFlowRate(flowrate || "0");
    const monthlyFlowRate = getMonthlyEtherValue(flowrate);

    const senderAbbr = shortenHex(sender);
    const receiverAbbr = shortenHex(recipient);

    const senderBlockie = new Blockie(sender);
    const receiverBlockie = new Blockie(recipient);

    // Removed ENS avatars for now:
    const senderName = undefined;
    const receiverName = undefined;
    const senderAvatarData = undefined;
    const receiverAvatarData = undefined;

    // Fetching all data concurrently with timeout and falling back to undefined values.
    // If value is missing then it just won't be rendered.
    const [
      // senderName,
      // receiverName,
      tokenSymbolData,
      tokenData,
      // senderAvatarData,
      // receiverAvatarData,
    ] = await Promise.allSettled([
      // promiseWithTimeout(getENSName(sender), TIMEOUT),
      // promiseWithTimeout(getENSName(receiver), TIMEOUT),
      promiseWithTimeout(fetchTokenIconData(symbol), TIMEOUT),
      promiseWithTimeout(
        fetchTokenData(tokenAddr.toLowerCase(), chain),
        TIMEOUT
      ),
      // promiseWithTimeout(getENSAvatar(sender), TIMEOUT),
      // promiseWithTimeout(getENSAvatar(receiver), TIMEOUT),
    ]).then((promiseResults) =>
      promiseResults.map((promiseResult) =>
        promiseResult.status === "fulfilled" ? promiseResult.value : undefined
      )
    );

    const isListed = (tokenData as TokenData)?.isListed;

    // Using puppeteer to render SVG and fetch token icon + token symbol + time unit combo width.
    // This is used to center this block horizontally which was not possible in SVG.

    const svgString = getNFTSVG({
      prettyFlowRate,
      monthlyFlowRate,
      chainId: chain,
      tokenSymbol: symbol,
      tokenSymbolData,
      senderName,
      senderAvatarData,
      senderBlockie,
      senderAbbr,
      receiverName,
      receiverAvatarData,
      receiverBlockie,
      receiverAbbr,
      isListed,
      transformIconSymbolX: getTokenSymbolBlockX(symbol),
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
