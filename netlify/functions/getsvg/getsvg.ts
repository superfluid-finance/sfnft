import { ValidationError } from "yup";
import { getNFTSVG } from "../../../api/assets/NFTSvg";
import Blockie from "../../../api/utils/Blockie";
import { promiseWithTimeout } from "../../../api/utils/ENSUtils";
import { getTokenSymbolBlockX, shortenHex } from "../../../api/utils/StringUtils";
import {
  fetchTokenData,
  fetchTokenIconData,
  fixBrokenFlowrate,
  getMonthlyEtherValue,
  getPrettyEtherFlowRate,
  TokenData,
} from "../../../api/utils/TokenUtils";
import { NFTRequestQuerySchema } from "../../../api/utils/ValidationUtils";
import { NFTRequestEvent } from "../getmeta/getmeta";

const TIMEOUT = 9000;

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
export const handler = async (event: NFTRequestEvent) => {
  try {
    await NFTRequestQuerySchema.validate(event.queryStringParameters);

    const {
      token_symbol: tokenSymbol,
      token,
      token_address,
      sender,
      receiver,
      flowRate,
      chain_id: chainId,
      start_date,
    } = event.queryStringParameters;

    const tokenAddr = (token_address || token) as string;

    const fixedFlowRate = fixBrokenFlowrate(flowRate, start_date);
    const prettyFlowRate = getPrettyEtherFlowRate(fixedFlowRate || "0");
    const monthlyFlowRate = getMonthlyEtherValue(fixedFlowRate);

    const senderAbbr = shortenHex(sender);
    const receiverAbbr = shortenHex(receiver);

    const senderBlockie = new Blockie(sender);
    const receiverBlockie = new Blockie(receiver);

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
      promiseWithTimeout(fetchTokenIconData(tokenSymbol), TIMEOUT),
      promiseWithTimeout(
        fetchTokenData(tokenAddr.toLowerCase(), chainId),
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
      chainId,
      tokenSymbol,
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
      transformIconSymbolX: getTokenSymbolBlockX(tokenSymbol),
    });

    return {
      statusCode: 200,
      body: svgString,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "image/svg+xml",
      },
    };
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: error.errors,
          field: error.path,
        }),
      };
    }
    return { statusCode: 400, body: error.toString() };
  }
};
