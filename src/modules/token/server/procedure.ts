import db from "@/db";
import { user } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { eq } from "drizzle-orm";

export const tokenRouter = createTRPCRouter({
  getProducts: protectedProcedure.query(async () => {
    const products = await polarClient.products.list({
      isArchived: false,
      sorting: ["price_amount"],
    });
      
      return products.result.items
  })
,  getTokens: protectedProcedure.query(async ({ ctx }) => {
    
    const [paidUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, ctx.user.id));
    return {
      token: paidUser.token,
    };
  }),
});
