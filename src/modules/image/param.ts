import { DEFAULT_PAGE } from "@/constant";
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const filterSeachParams = {
  search: parseAsString.withDefault(" ").withOptions({ clearOnDefault: true }),
  pages: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filterSeachParams);
