import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const PermissionSearchParams = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(5),
  nama: parseAsString.withDefault(""),
  date: parseAsString.withDefault(""),
});

export type PermissionSearchParamsType = {
  page: number;
  perPage: number;
  nama: string;
  date: string;
};
