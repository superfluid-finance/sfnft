// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    console.log(`event: ${JSON.stringify(event, null, 2)}`);

    // best guess for testing, should be config provided for prod
    const baseURL = `https://${event.headers.host}`;
    const imageUrl = `${baseURL}/.netlify/functions/getsvg?${event.rawQuery}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        name: `CFA NFT`,
        description: `This NFT represents a Superfluid Constant Flow. TODO: link to streaming page`,
        image: imageUrl,
      }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
