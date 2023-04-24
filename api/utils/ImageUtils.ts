import axios from "axios";

declare const {from}: { from: (arg0: ArrayBuffer) => { (): any; new(): any; toString: { (arg0: string): string; new(): any; }; }; };

export const getImageBase64Data = (imageUrl: string) => axios.get(imageUrl, { responseType: 'arraybuffer' })
    .then(response => {
        return `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
    });
