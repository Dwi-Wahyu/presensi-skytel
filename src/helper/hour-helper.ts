import { format } from "date-fns";

export function formatToHour(date: Date): string {
  return format(date, "HH:mm");
}
