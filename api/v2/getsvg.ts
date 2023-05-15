import { VercelResponse } from "@vercel/node";
import { ValidationError } from "yup";
import { getNFTSVG } from "../assets/NFTSvgV2";
import Blockie from "../utils/Blockie";
import { promiseWithTimeout } from "../utils/ENSUtils";
import { NFTRequest } from "../utils/RequestUtils";
import { getTokenSymbolBlockX, shortenHex } from "../utils/StringUtils";
import {
  TokenData,
  fetchTokenData,
  fetchTokenIconData,
  fixBrokenFlowrate,
  getMonthlyEtherValue,
  getPrettyEtherFlowRate,
} from "../utils/TokenUtils";
import { NFTRequestQuerySchema } from "../utils/ValidationUtils";
import { format, fromUnixTime } from "date-fns";

const TIMEOUT = 9000;

export const handler = async (
  request: NFTRequest,
  response: VercelResponse
) => {
  try {
    await NFTRequestQuerySchema.validate(request.query);

    const {
      token_symbol: tokenSymbol,
      token,
      token_address,
      sender,
      receiver,
      flowRate,
      chain_id: chainId,
      outgoing,
      start_date,
    } = request.query;

    const isOutgoing = outgoing === "true";

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

    const svgString = getNFTSVG({
      monthlyFlowRate,
      chainId,
      tokenSymbol,
      tokenSymbolData,
      counterpartyAbbr: isOutgoing ? receiverAbbr : senderAbbr,
      counterpartyAvatarData: isOutgoing
        ? receiverAvatarData
        : senderAvatarData,
      counterpartyBlockie: isOutgoing ? receiverBlockie : senderBlockie,
      isListed,
      isOutgoing,
      startDate: fromUnixTime(Number(start_date)),
      transformIconSymbolX: getTokenSymbolBlockX(tokenSymbol),
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
