export const objectToQueryString = (query: { [key: string]: string | string[] }) => Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");