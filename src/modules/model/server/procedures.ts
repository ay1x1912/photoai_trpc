import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { trainModelSchema } from "../schema";
// import { FalAiModel } from "@/model/falAiModel";
import db from "@/db";
import { model } from "@/db/schema";
import { eq } from "drizzle-orm";
import {z} from "zod"

export const modelRouter = createTRPCRouter({
  getModel: protectedProcedure.input(z.object({name:z.string().default("")})).query(async({ ctx }) => {
    const models = await db.select().from(model).where(eq(model.userId, ctx.user.id))
    if (!models) {
      throw new TRPCError({code:"NOT_FOUND" ,message:"Models not found"},)
    }
    return models
  }),
  createModel: protectedProcedure
    .input(trainModelSchema)
    .mutation(async ({ input, ctx }) => {
      const {zipUrl ,thumbNailUrl}=input
      // call the ai model
      //     const falModel = new FalAiModel();
      //  const request_id = await falModel.trainModel(zipUrl,name);
      const request_id = "hello world";
      if (!request_id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fal ai api called failed",
        });
      }
      //db call
        const [createdModel] = await db.insert(model).values({ ...input, zipUrl:zipUrl!, thumbnailUrl:thumbNailUrl!, userId: ctx.user.id, falAiRequest_id: request_id }).returning();
        return createdModel
    }),
});
