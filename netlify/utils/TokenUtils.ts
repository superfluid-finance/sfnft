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

export const getMonthlyEtherValue = (flowRate: string) =>
  getPrettyEtherValue(
    BigNumber.from(flowRate).mul(BigNumber.from(2592000)).toString()
  );
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
      ).catch(() => undefined)
    )
    .catch(
      () =>
        `data:image/webp;base64,UklGRm4PAABXRUJQVlA4TGEPAAAv/8A/EBX5erVt2dts2/7/r7po247TyeUy12VMysxc54B9X7fds3vx0JW6zMwMrn3ZEZaZmZnbsC7bW+CUUwjJFzPzdTm54MyUc1yKy4aLmZmiTlFAjsogMZLcOJLgvytr0jpw/yuhq0EQkB3bdt22ui5exsU9+wD22L9OUkokAAxAgIlt27Zt27btZ9u2bdu2bbtu59dkQZIdt82sc5Ir+JT4HoAH8NeLUxC/ksFbjgFkEYwlexbDUsLrGXaydJjMWbKvMzwi/Ibsbyz1MKA3X37e6wNfuCpjtI7Fkru3/2fwlqMvy1T8+0ueZU/CxQyzGY4QfsvinybUtYxekX2QpRmMCwKV29AyhxxpUEnF4hcuV6O6nOEMiwWVRTo6ZcYxwvkjGL1TS+pgWEXc7NFlyTGbh8qCY2XwoffFUwySapZuKpg+waLqVIfyrvgvksuKZbGbxW8F1J0TgqyYRjfChU2gmsuiRWH1yVvecR7F/61CdRvJ3Fdw1ZDd4LSWih6pk+80lrpVgL5GeOoerqILaTiL7J8qRId8dLqLCF5syd5CMKCC1JNg8w9dw/vaPlepOF31e5fAvtGELzEgUnuSb6QrKHpkx3BexaqTyuYuIIinRLD8WhUsMn9v+bh0No8QYqhk0aHCNZZMxYuiuadGHaCae+TCD2oMGxn+qxPUQnjDH4RGVywNulmdoZtfbhQIYz+GZ+oUTd9XGptHCG7fUx2jnlSMqZD1mIxOqIP0gz8IIqf0ZmhWJym/sxQ2/wjhsNPcc9YUEYzeUx2mPf8gAOKFkt2pTlP+InSKI0QJz2xRx6mF0fQPQVMcIfWCOlAvHAnMewNVRjfUiRr1WdzH71BHqmM0aocC4Y+KSMnZLFAHRdTL70DCeq5kuhSRHGKdbay7nQBQRO2XIuYWCfczAMlSvVg/gs0jWKY/UEidmXsIgIMgfbZCUlzFutFIs00jeL+FQorwrz5gXNuimHSfSZpm2aozQb0AIbsECrJnKagWPEm6NdlClSioCI8EIsgqV1Da19xGaTbYRkFBxaIK59FgM+vPp6XJ6lC5NpcVC0IA/ocoKNusG0EPwFpUDyEIhIDOcyG7VxXW0wO4FtXBVFgj9KazaFdcT48gW5Tgy/v8jKxTnKV5nuJ6QoC2KMPrj1tmgW8hQ+axwrJ0L9IQoC2qo/5olZLPECc4pwrrWS+CKC6a04XC6skpNnsXWDqkCuyJIlt9BoorRpsq7MEwXnFZ+GzSUNAtqs32Iu1rcWlfextxGJYz4HKtrZ7poYzeKbInDtlyvVBcbTvXn1CwA5m9istcdVgvgggEWHSCFchUKDCrzCCNQIJFB1ug6LEVS9+hPXHJFjkJMIT7y81PjzpecSmyuDcSERZ9/UjT9Fdglu1JGokMi/YyDIsMhfZEI8SiVCQZhfnS3w/bE40Uy8gcaWASFscV2hMDKRa9xyBBkqDQnjiIsejx5oLtl7E9SclW6AUyL//RFA3YnuRsFgG0pcEQXf5vs2psTywEWaoNjVN/QYFZpJPUBFnJ2Ui3jMH2mGGjbWBbhHuWu4s0JsIssj2pKR6exwdoi2yPMbK1doBtEewp6U0aG6dYcg8B0J51ohEfaZYzk9GJ7YmPNEtnIujYA9uTAHGWgUlgsR/akwRxlnwCAj+TFmhPEsRZWop8TRMk26A95vlXFwvFVf/4f86G9pgn69YT5NmqxVmacSFYrrjMW0maDIEWhvkx6fpKg9EPYFafTkIEWppj/jEG2mOHbLFOhEUfQ4H/7GoxLikSLWR3xuqIJbtBcVnhTlJbZN3vQnFVG4caZI89MmAL2ddjEBgLhaWwfXJEWlqYayxojM1ivUmTI9PSHM15wB4DyLQweiUn4bDiTFK7ZPVios9esMxXh9QEQi1joopIsGjB9RhBqIWhuTGipxXYY59sid4oqoJURDgsbcf1ILDJBrCW/qHM8yWkye7D9ZhBqoXs3j+GUYnrwSCbvw4Kqkr8fGNhexTW3Q5+/rECtXjWEv1Bagqxlp9W9AjXpwOq56s4HH+2YmoQesj9mRSHbOU7QQ++85gsUElqDrmWPPaRwmtYTMc+MAjVYxDBlkHIR7b5qkkEW2qRj3SfQWoSwZY88JFJKR7ZJ3EPDML0IDK9AHugFtODSLZUb2AP9If0YHL82aixdyekB5Psz6hjcBiaET2oZIA1mvJbMdefUECcUW8c0ZZayLFWz6e4ZHWQxkpADzIX4VlYZHjfDDij3jyiLc2AKecFT5JaQLSl3vsaOI8NRFtqvEdbKuaw1AaiLV/z0+DKiVhBtmXamXAeK8i2nDkGbVIpMqgFSsaQqQArJyKDYViWwYFqOJjHErItBzdgeYABnp3fzDAfy4MK9tTUhl5QHmvItvSqR/JAAzw7v/4eJA86qAVK7iH7OtCMeovItgwk+znQvCqLyLbUMHqP47GJbEu/PMyMeqvItuSrYcqJWEW2pboaxWMX2ZbqPIrHLrIteYxTfp3KJDsGgvp+EHS7A6m0YdgGgjzqWtuQyL9AZiYPvEcxVIR4fr0IpPHw8r14DeW6G2fQzTYrzUAWa8ygAyfuqlccLVjJmtuRwwbbWaQSpJEHvRRIjUv24nEZbBqNZXsBVZWkV4NC6exuM5HAajMptlAoNWDkXds1RPNVssY20Fl/G5NCP1yMvCvGqKuSk4S+BLYv3pt1N0Bm0w2W7k3o57r2Uxh5d5B+h9XvYK0ZzFVF6Hj75WeCy8ozCe1z+3Z7HmTyyZEYlG+8weYbrHgXf9EQzVOH7TGZfrOG6C89f9FZDjL7LEcaKIaOybKNt7H42bAhbNzlgetsgMfu/ylojxzyn91xKrT+ZPMIIZRFZLvfRZZl60xnRuh34kNgRH1b7wY0G+2EFz1K4jGHWH8b2dafjPLQJ4ZVd4BExNNafalmcwiccRcwF97zVPFwqbGhS/Ym9Kdj0bO51wjGI6zCrONLhR07A408b1AU1cV6dlzmLtbfwACmI6ybp6N1vTZAjbtbazqxXh3n9GGV6STHbIR19oCstJqA5l5Cjbscvkk0wq6OTKYkTEZY7bfekZWmE+jSeyDWuNuSswm9OjaYkjAYYU3qF1acHGrcLdbAs7bw6MhYSsJYhDV8J8wpOAzNfivIvg5EkWHDbUR8zxhKSRiKsBo/8kDoO/QM0rh7uHkX85/DwxHPGWZSEmYirNGfCH8d2hlq3gXevJvWJK8ZP4+LmQgLeG2OWrx5V4Wm6GuG5CkJIxFWFk5TAWveFeC8u+FVkdeMUSkJMxw/KzLCCqcKK+u0H+S8yyEJY4bjTFBfHh5hgReiymPOux2QNGbcPhHRsWt9nOcjzNWoBm0NVlNRSpqSSPIOzjo+i2biM2D8BHTefe8sUglTEvG/QW+eHisE661YMHoPW3fhpCxSyVIS4U9QsSIs7GWpCK+HrbtRWGc7WaQSpSTCXqCiIqxYTC3AFt4ZpGiay8VFJhKnbx0czsOvvBYVYcWi6nVF4yfAdXeeiE6cJ0lJxLhAHb5TkhqMaEeg6y6tfgfR4USClER0gPKRB7K45KELj1WGg9IRkcXW+tvZMyIlsRV1jbEirDhtlUPX3foj4NrqC1diKpO2TUV4cqHjxiyBeiscJ8wEr7vXrScWxoy89srDmagq7P3R6y629zM+Zqj2X1kSTW1HrLsYUXcTcSdFO19koiclPLmQcIzl64h7OGzEL7p+rMmetL/0/IW8qktj4qy4gt5UvGgsNLmQjLyI1VcYvVJFbypBNDZjtyypOssROU9G3e1jsnDFjcbOrs+S60IZdbe/pJDqfidZclVVZcnpdheYddfj7NyxRhWzKQD1a0evuw9efHLnh+1z0c5C1l3Yqv8RdN2NOvscq5DsN1TQuitNtmmStPriZ0H/GF5ll87hoOvuTBO17lLJ2djlGFlr0H9gtmKqzSb1qOtuBX4mPkwSqs8/M9FmW6DU+9gUZTm3KKZ6W2vq4Z0Vk5bgLUd56+232qJO3rqL/kxUCpaaahK37mYPY3Dc0VTVcNh1V2XuuGCIDWqB1xtJJobTiqoBFiZV4m7LzyeEyuYEA+qIpiY+A7s3yb4+qcYoqnqbbqs37pKbgtfdP8ksrcBbjxC874LCVKNtFWAZ40tJqOX1i0y2he5JbKlWVD1hjiGKSnVf6fvuWP0OTDEAft8dxiyYHRGy29KX/yh/1zkXmqE3/L5bRFt0ZDjitlxwj/l99wjtiJhagGW/yd67YOc5Oydu6qLXFRYqx/n4ErYI+bFSV5nUMcY3mDtKaFN5hYWlm43etCZfLrKpieXIJ5lXpcLqmGRtgccbzth6V4KRBiPRdxphYetl4pqa2g4LwZNPeju67nLcph4W1tblucLSl5JLzqmL28MOS6UPlSuuPppEtTXG6vbiyT6gcjoiOsthGVZhd+OZTyqqaqX0sKs++UnbGw9leKSoapOyv4DX/+ht67O7yuiI6Afb1jc+6+2LCuufqoDe+It2VlB++hzGhrNh993bKqCtQ1KPoVxW7LWwvfHwPeyzX/QoYlGF3lTncFSIm+1xxDAetjcevK1mj6QvtKD2xiP3sLcwLkTbd3k1blP9QLsZqlmkeDSduR9qb/zDoG19jbEf4rbzQbcmstodtCokZFqv84hirnEHZg4G9GrzOZfedgIkhG+dD3zbEW6E7KNB/Ep6XC0QIcawzYUw7MS+EaMKhlE9oylz779mX8If3MbLEu495tTDXcYPQjYYXTafxegP1W0Uc+9B+/Zx1Gm5LCdJt5V4uNtOk3KWw06Tc5ZzTpOnxkA1/HJ3cPkpjV6kuuroktnhCgZM9GJFEHiGCzgj9OYqymITSz1kNzT6EJXFpgHTvAP0xhmiXW7QlIdYPJTJ51jKmeLdoSArhsxleTzJKMw7RnTsQfaeayVxLZm9d3sHKfAzYbR2kphr7BHveEeJ8ker4WYRr7Sf/oN3mIriW47KIxia0cmf8rB3nbqQhoxHMzzDheznn+9CGno3KqdyJ7PoAUQIvt4yw7v01pODVATBZrD79Lp5RO5VyIvetXpX/JN4g9EkRldmgwwfYXGVYTJD0I+8o/VH8o0kexZLdy1fjlw7hmE21Y36o3e8Pk710giWs/TSFiyeUrH4rx/3ZYSKdHQqGeYffodZ7jh8zEPTfFmjKT95ikzFJ4adkXAU3yFnDGNpDkMl8UKnT/FlmibvGyQJhPNZ1H1+POHVLHYRPsXSTYIXLFpUP/nBT5z4iwvHf771DLbj953s5ckDAA==`
    );
};
