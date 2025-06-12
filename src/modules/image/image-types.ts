import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

;
export type ImageGetMany =
  inferRouterOutputs<AppRouter>["image"]["getImages"]["images"];
