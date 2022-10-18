import Decimal from "decimal.js";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import minBy from "lodash/fp/minBy";
import fetch from "node-fetch";
import { getDecimalPlacesToRoundTo } from "./DecimalUtils";
import { getImageBase64Data } from "./ImageUtils";

const TOKEN_API_URL =
  "https://raw.githubusercontent.com/superfluid-finance/assets/master/public";

export interface FlowRateEther {
  amountEther: string;
  unitOfTime: UnitOfTime;
}

export enum UnitOfTime {
  Second = 1,
  Minute = 60,
  Hour = 3600,
  Day = 86400,
  Week = 604800,
  Month = 2592000,
  Year = 31536000,
}

export const unitOfTimeList = [
  UnitOfTime.Second,
  UnitOfTime.Minute,
  UnitOfTime.Hour,
  UnitOfTime.Day,
  UnitOfTime.Week,
  UnitOfTime.Month,
  UnitOfTime.Year,
];

export const timeUnitWordMap: Record<UnitOfTime, string> = {
  [UnitOfTime.Second]: "second",
  [UnitOfTime.Minute]: "minute",
  [UnitOfTime.Hour]: "hour",
  [UnitOfTime.Day]: "day",
  [UnitOfTime.Week]: "week",
  [UnitOfTime.Month]: "month",
  [UnitOfTime.Year]: "year",
};

export const getPrettyEtherValue = (weiValue: string) => {
  const etherValue = new Decimal(formatUnits(weiValue, "ether"));
  const decimalsToRoundTo = getDecimalPlacesToRoundTo(etherValue);
  return etherValue.toDP(decimalsToRoundTo).toString();
};

export const getPrettyEtherFlowRate = (flowRateWei: string): FlowRateEther =>
  minBy(
    (flowRateEther) => flowRateEther.amountEther.length,
    unitOfTimeList.map((timeUnit) => ({
      unitOfTime: timeUnit,
      amountEther: getPrettyEtherValue(
        BigNumber.from(flowRateWei).mul(BigNumber.from(timeUnit)).toString()
      ),
    }))
  ) || {
    unitOfTime: UnitOfTime.Month,
    amountEther: getPrettyEtherValue(
      BigNumber.from(flowRateWei).mul(UnitOfTime.Month).toString()
    ),
  };

interface TokenManifest {
  svgIconPath: string;
}

export const fetchTokenIconData = async (symbol: string) => {
  const assetKey =
    symbol === "mStable USD (Polygon PoS)"
      ? "mstable-usd-polygon-pos"
      : symbol.toLowerCase();

  return fetch(`${TOKEN_API_URL}/tokens/${assetKey}/manifest.json`)
    .then((res) => res.json())
    .then((response) =>
      getImageBase64Data(
        `${TOKEN_API_URL}${(response as TokenManifest).svgIconPath}`
      ).catch((e) => {
        console.log(e);
        return undefined;
      })
    )
    .catch(() => undefined);
};
