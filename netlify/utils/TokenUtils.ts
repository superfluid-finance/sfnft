import Decimal from "decimal.js";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import minBy from "lodash/fp/minBy";
import { getDecimalPlacesToRoundTo } from "./DecimalUtils";

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
  console.log(etherValue.toString());
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
