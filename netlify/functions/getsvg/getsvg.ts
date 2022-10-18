import { format } from "date-fns";
import { ValidationError } from "yup";
import { ENSAvatarData, getENSData } from "../../utils/ENSUtils";
import { shortenHex } from "../../utils/StringUtils";
import { getPrettyEtherFlowRate } from "../../utils/TokenUtils";
import { NFTRequestQuerySchema } from "../../utils/ValidationUtils";
import { NFTRequestEvent } from "../getmeta/getmeta";

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
export const handler = async (event: NFTRequestEvent) => {
  try {
    await NFTRequestQuerySchema.validate(event.queryStringParameters);

    const { token_symbol, sender, receiver, flowRate, start_date } =
      event.queryStringParameters;

    const startDate = start_date
      ? `${format(new Date(Number(start_date) * 1000), "d LLL yyyy HH:mm")} UTC`
      : "NaN";

    const prettyFlowRate = getPrettyEtherFlowRate(flowRate || "0");
    const senderAbbr = shortenHex(sender);
    const receiverAbbr = shortenHex(receiver);

    const [senderName, receiverName, senderAvatar, receiverAvatar] =
      await getENSData(sender, receiver);

    const retStr = `
    <svg width="28" height="56" viewBox="0 0 28 56" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${
      senderAvatar
        ? `<image width="28" height="28" xlink:href="${senderAvatar}" />`
        : ""
    }
    ${
      receiverAvatar
        ? `<image y="28" width="28" height="28" xlink:href="${receiverAvatar}" />`
        : ""
    }
    </svg>`;

    return {
      statusCode: 200,
      body: retStr,
      headers: {
        "Content-Type": "image/svg+xml",
      },
    };
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
    return { statusCode: 500, body: error.toString() };
  }
};
