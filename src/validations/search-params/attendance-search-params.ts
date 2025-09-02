import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const AttendanceSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(5),
  nama: parseAsString.withDefault(""),
  date: parseAsString.withDefault(""),
});

export type AttendanceSearchParamsType = {
  page: number;
  perPage: number;
  nama: string;
  date: string;
};
