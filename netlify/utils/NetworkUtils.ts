import {
  ARBITRUM_ICON,
  AVALANCHE_ICON,
  BNB_ICON,
  getTestNetworkIcon,
  GNOSIS_ICON,
  OPTIMISM_ICON,
  POLYGON_ICON,
} from "../assets/NetworkIcons";

export const NetworkSlugs = {
  5: "goerli",
  100: "gnosis",
  137: "polygon",
  80001: "polygon-mumbai",
  43113: "avalanche-fuji",
  10: "optimism",
  42161: "arbitrum-one",
  43114: "avalanche",
  56: "bsc",
};

export const NetworkNames = {
  5: "Goerli",
  100: "Gnosis Chain",
  137: "Polygon",
  80001: "Polygon Mumbai",
  43113: "Fuji (C-Chain)",
  10: "Optimism",
  42161: "Arbitrum One",
  43114: "Avalanche C",
  56: "BNB Smart Chain",
};

export const NetworkIcons = {
  5: getTestNetworkIcon("G", "#9064ff"),
  100: GNOSIS_ICON,
  137: POLYGON_ICON,
  80001: getTestNetworkIcon("P", "#3099f2"),
  43113: getTestNetworkIcon("F", "#2b374b"),
  10: OPTIMISM_ICON,
  42161: ARBITRUM_ICON,
  43114: AVALANCHE_ICON,
  56: BNB_ICON,
};
