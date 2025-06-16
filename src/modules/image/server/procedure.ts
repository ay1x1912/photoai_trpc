import { createTRPCRouter, paidProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { GenerateImageFromPrompt } from "../schema";
import db from "@/db";
import { model, outputImage, user } from "@/db/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { FalAiModel } from "@/model/falAiModel";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constant";

export const imageRouter = createTRPCRouter({
  getOneWithId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const [modelId]=await db.select({id:outputImage.modelId}).from(outputImage).where(
        and(eq(outputImage.userId, ctx.user.id), eq(outputImage.id, id))
    )
      const image = await db
        .select()
        .from(outputImage)
        .where(
          and(eq(outputImage.userId, ctx.user.id), eq(outputImage.id, id))
      ).innerJoin(model,eq(model.id,modelId.id))
      

      if (!image) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Image not found" });
      }
      return image;
    }),
  getImages: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;
   
      const images = await db
        .select()
        .from(outputImage)
        .where(eq(outputImage.userId, ctx.user.id))
        .orderBy(desc(outputImage.createdAt), desc(outputImage.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(outputImage)
        .where(eq(outputImage.userId, ctx.user.id));
      const totalPages = Math.ceil(total.count / pageSize);
      return {
        images,
        total: total.count,
        totalPages,
      };
    }),
  create: paidProcedure("image")
    .input(GenerateImageFromPrompt)
    .mutation(async ({ input, ctx }) => {
      const { modelId, prompt ,styles } = input;
      const [selectedModel] = await db
        .select()
        .from(model)
        .where(and(eq(model.id, modelId), eq(model.userId, ctx.user.id)));
      if (!selectedModel) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Model not found" });
      }
     
      await db.update(user).set({ token: sql`${user.token} -1` }).where(eq(user.id,ctx.user.id))


      // genreate image call to the ai model
      const falModel = new FalAiModel();
      console.log(prompt, "Prompt");
      console.log(model.tensorPath, "tesnorpath");
     
      const request_id = await falModel.generateImages(prompt,selectedModel.tensorPath!)
      // const request_id = "hello workd";
      if (!request_id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fal ai api called failed",
        });
      }
      //db call to save the image
      const [outPutImage] = await db
        .insert(outputImage)
        .values({
          ...input,
          userId: ctx.user.id,
          falAiRequest_id: request_id,
          imageUrl: " ",
          styles,
        })
        .returning();
      return outPutImage;
    }),
});
