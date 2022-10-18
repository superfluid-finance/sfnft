import { format } from "date-fns";
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

    const retStr = ``;

    return {
      statusCode: 200,
      body: retStr,
      headers: {
        "Content-Type": "image/svg+xml",
      },
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
