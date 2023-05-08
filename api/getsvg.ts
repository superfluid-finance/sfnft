import {ValidationError} from "yup";
import {getNFTSVG} from "./assets/NFTSvg";
import Blockie from "./utils/Blockie";
import {promiseWithTimeout} from "./utils/ENSUtils";
import {getTokenSymbolBlockX, shortenHex} from "./utils/StringUtils";
import {
    fetchTokenData,
    fetchTokenIconData,
    fixBrokenFlowrate,
    getMonthlyEtherValue,
    getPrettyEtherFlowRate,
    TokenData,
} from "./utils/TokenUtils";
import {NFTRequestQuerySchema} from "./utils/ValidationUtils";
import {VercelRequest, VercelResponse} from "@vercel/node";

const TIMEOUT = 9000;

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
export const handler = async (request: VercelRequest, response: VercelResponse) => {
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
            start_date,
        } = request.query as {
            chain_id: string;
            token_symbol: string;
            sender: string;
            receiver: string;
            flowRate: string;
            token_address: string | undefined;
            token: string | undefined;
            start_date: string | undefined;
            token_decimals: string | undefined;
        };

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
        response.status(200).setHeader("Access-Control-Allow-Origin", "*").setHeader("Content-Type", "image/svg+xml").send(svgString);
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
        response.status(400).send(error)
    }
};

export  default handler;