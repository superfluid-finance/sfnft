import chromium from "chrome-aws-lambda";
import { ValidationError } from "yup";
import { getNFTSVG } from "../../assets/NFTSvg";
import Blockie from "../../utils/Blockie";
import { promiseWithTimeout } from "../../utils/ENSUtils";
import { shortenHex } from "../../utils/StringUtils";
import {
  fetchTokenIconData,
  getMonthlyEtherValue,
  getPrettyEtherFlowRate,
} from "../../utils/TokenUtils";
import { NFTRequestQuerySchema } from "../../utils/ValidationUtils";
import { NFTRequestEvent } from "../getmeta/getmeta";

const TIMEOUT = 9000;

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
export const handler = async (event: NFTRequestEvent) => {
  let browser;

  try {
    await NFTRequestQuerySchema.validate(event.queryStringParameters);

    const {
      token_symbol: tokenSymbol,
      sender,
      receiver,
      flowRate,
      chain_id: chainId,
    } = event.queryStringParameters;

    const prettyFlowRate = getPrettyEtherFlowRate(flowRate || "0");
    const monthlyFlowRate = getMonthlyEtherValue(flowRate);

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
      // senderAvatarData,
      // receiverAvatarData,
    ] = await Promise.allSettled([
      // promiseWithTimeout(getENSName(sender), TIMEOUT),
      // promiseWithTimeout(getENSName(receiver), TIMEOUT),
      promiseWithTimeout(fetchTokenIconData(tokenSymbol), TIMEOUT),
      // promiseWithTimeout(getENSAvatar(sender), TIMEOUT),
      // promiseWithTimeout(getENSAvatar(receiver), TIMEOUT),
    ]).then((promiseResults) =>
      promiseResults.map((promiseResult) =>
        promiseResult.status === "fulfilled" ? promiseResult.value : undefined
      )
    );

    // Using puppeteer to render SVG and fetch token icon + token symbol + time unit combo width.
    // This is used to center this block horizontally which was not possible in SVG.
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    // const page = await browser.newPage();
    // await page.setContent(
    //   getNFTSVG({
    //     prettyFlowRate,
    //     monthlyFlowRate,
    //     chainId,
    //     tokenSymbol,
    //     tokenSymbolData,
    //     senderName,
    //     senderAvatarData,
    //     senderBlockie,
    //     senderAbbr,
    //     receiverName,
    //     receiverAvatarData,
    //     receiverBlockie,
    //     receiverAbbr,
    //   })
    // );
    // const element = await page.$("#token-symbol-combo");
    // const boundingBox = await element?.boundingBox();
    const boundingBox = { width: 30 };
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

      transformIconSymbolX: boundingBox
        ? Math.floor((700 - boundingBox.width) / 4)
        : 80, // 700 because svg width is 700px but viewbox 350. That's why we divide everything with 4 instead of 2.
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
    return { statusCode: 500, body: error.toString() };
  } finally {
    if (browser) browser.close();
  }
};
