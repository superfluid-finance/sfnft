import {
  ARBITRUM_ICON,
  AVALANCHE_ICON,
  BASE_ICON,
  BNB_ICON,
  getTestNetworkIcon,
  GNOSIS_ICON,
  OPTIMISM_ICON,
  POLYGON_ICON,
} from "../assets/NetworkIcons";

interface Network {
  slug: string;
  name: string;
  color: string;
  icon: string;
  subgraphUrl: string;
}

export const networks: { [any: number]: Network } = {
  5: {
    slug: "goerli",
    name: "Goerli",
    icon: getTestNetworkIcon("G", "#9064ff"),
    color: "#9064ff",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli",
  },
  100: {
    slug: "gnosis",
    name: "Gnosis Chain",
    icon: GNOSIS_ICON,
    color: "#04795b",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-xdai",
  },
  137: {
    slug: "polygon",
    name: "Polygon",
    icon: POLYGON_ICON,
    color: "#7c3fe4",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-matic",
  },
  80001: {
    slug: "polygon-mumbai",
    name: "Polygon Mumbai",
    icon: getTestNetworkIcon("P", "#3099f2"),
    color: "#3099f2",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai",
  },
  43113: {
    slug: "avalanche-fuji",
    name: "Fuji (C-Chain)",
    icon: getTestNetworkIcon("F", "#2b374b"),
    color: "#2b374b",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-avalanche-fuji",
  },
  10: {
    slug: "optimism",
    name: "Optimism",
    icon: OPTIMISM_ICON,
    color: "#ff0320",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-optimism-mainnet",
  },
  42161: {
    slug: "arbitrum-one",
    name: "Arbitrum One",
    icon: ARBITRUM_ICON,
    color: "#2b374b",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-arbitrum-one",
  },
  43114: {
    slug: "avalanche",
    name: "Avalanche C",
    icon: AVALANCHE_ICON,
    color: "#e84142",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-avalanche-c",
  },
  56: {
    slug: "bsc",
    name: "BNB Smart Chain",
    icon: BNB_ICON,
    color: "#F0B90B",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-bsc-mainnet",
  },
  8453: {
    slug: "base",
    name: "Base",
    icon: BASE_ICON,
    color: "#68B1D5",
    subgraphUrl: "https://base-mainnet.subgraph.x.superfluid.dev/",
  },
};
