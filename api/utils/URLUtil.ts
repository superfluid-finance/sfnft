export const objectToQueryString = (query: Record<string, string>) =>
  Object.entries(query)
    .map(([key, value]) => new URLSearchParams({ [key]: value }))
    .join("&");
