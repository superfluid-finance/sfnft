declare const Buffer;

import fetch from "node-fetch";

export const getImageBase64Data = (imageUrl: string) =>
  fetch(imageUrl).then((response) => {
    return response
      .arrayBuffer()
      .then(
        (buffer) =>
          `data:${response.headers.get("content-type")};base64,` +
          Buffer.from(buffer).toString("base64")
      );
  });
