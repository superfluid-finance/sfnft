// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {

    console.log(`event: ${JSON.stringify(event, null, 2)}`);

    const tokenId = event.queryStringParameters.tokenId;

    // best guess for testing, should be config provided for prod
    const baseURL = `https://${event.headers.host}`;

    // get params needed by SVG...
    // TODO - just placeholders for now
    const sender = "0x0000000000000000000000000000000000000000";
    const receiver = "0xdeadbeafdeadbeafdeadbeafdeadbeafdeadbeaf";

    const imageUrl = `${baseURL}/getsvg/${tokenId}?sender=${sender}&receiver=${receiver}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
          name: `CFA NFT`,
          description: `This NFT represents a Superfluid Constant Flow. TODO: link to streaming page`,
          image: imageUrl
      }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
