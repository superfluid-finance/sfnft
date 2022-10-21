export function shortenHex(address: string, length = 4) {
  return `${address.substring(0, 2 + length)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

// Token icon + symbol + time unit block width without token symbol
const EMPTY_BLOCK_WIDTH = 231.43;

export const getTokenSymbolBlockX = (tokenSymbol: string) =>
  (700 -
    EMPTY_BLOCK_WIDTH -
    tokenSymbol
      .split("")
      .reduce(
        (totalWidth, letter) => totalWidth + (TokenSymbolLetters[letter] || 20),
        0
      )) /
  4;

// Calculated widths of all GT Walsheim Pro letters with token symbol styles.
const TokenSymbolLetters = {
  a: 20.625001907348633,
  A: 23.333351135253906,
  b: 20.625001907348633,
  B: 20.364601135253906,
  c: 18.88888931274414,
  C: 26.909740447998047,
  d: 20.625001907348633,
  D: 24.444446563720703,
  e: 18.88888931274414,
  E: 18.940990447998047,
  f: 14.444461822509766,
  F: 18.42013931274414,
  g: 20.625001907348633,
  G: 30.000001907348633,
  h: 19.704862594604492,
  H: 23.298612594604492,
  i: 8.645851135253906,
  I: 9.236111640930176,
  j: 11.006961822509766,
  J: 19.774307250976562,
  k: 18.88888931274414,
  K: 22.222240447998047,
  l: 8.680556297302246,
  L: 17.79513931274414,
  m: 28.975696563720703,
  M: 28.454862594604492,
  n: 19.704862594604492,
  N: 22.916685104370117,
  o: 19.565990447998047,
  O: 27.77777862548828,
  p: 20.625001907348633,
  P: 21.111112594604492,
  q: 20.625001907348633,
  Q: 27.77777862548828,
  r: 13.333351135253906,
  R: 21.180557250976562,
  s: 15.92013931274414,
  S: 19.21875,
  t: 13.333351135253906,
  T: 20,
  u: 19.53125,
  U: 22.291685104370117,
  v: 20,
  V: 22.22222328186035,
  w: 28.88888931274414,
  W: 36.66665267944336,
  x: 20,
  X: 23.333351135253906,
  y: 19.704862594604492,
  Y: 23.33333396911621,
  z: 17.777795791625977,
  Z: 21.336807250976562,
};
