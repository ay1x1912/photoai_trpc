import { DEFAULT_PAGE } from "@/constant";
import { parseAsInteger, useQueryStates, parseAsString } from "nuqs";
export const useFilters = () => {
  return useQueryStates({
    search: parseAsString
      .withDefault(" ")
      .withOptions({ clearOnDefault: true }),
    pages: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
  });
};
