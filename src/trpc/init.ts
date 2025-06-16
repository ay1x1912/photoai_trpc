import db from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: session.user } });
});
export const paidProcedure = (entity: "image" | "model") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.user.id,
    });
    const [data] = await db.select().from(user).where(eq(user.id, ctx.user.id));
    const isPaid = customer.activeSubscriptions.length > 0;
    const isImagePermited = data.token >= 1;
    const isModelPermited = data.token >= 4;
    const shouldThrowImageError =
      entity === "image" && !isImagePermited && !isPaid;
    const shouldThrowModelError =
      entity === "model" && !isModelPermited && !isPaid;

    if (shouldThrowImageError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No enough tokens to generate images",
      });
    }
    if (shouldThrowModelError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No enough tokens to generate Model",
      });
    }
     return next({ctx:{...ctx,customer}})
  });
