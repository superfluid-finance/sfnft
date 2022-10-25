import { format } from "date-fns";

export const formatTraitDate = (startDate?: string) => {
  if (!startDate) return null;
  const timestamp = Number(startDate) * 1000;
  return `${format(timestamp, "d MMM. yyyy")} ${format(timestamp, "HH:mm")}`;
};
