import {
  createTRPCRouter,
  paidProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { trainModelSchema } from "../schema";
// import { FalAiModel } from "@/model/falAiModel";
import db from "@/db";
import { model, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { Ethinicity, EyeColor, Gender } from "../types";
import { Status } from "@/modules/image/type";
import { nanoid } from "nanoid";

export const modelRouter = createTRPCRouter({
  insertModelsOnCreate: protectedProcedure.mutation(async ({ ctx }) => {
    await db.update(user).set({ token: 3 }).where(eq(user.id, ctx.user.id));
    await db.insert(model).values({
      id: nanoid(),
      name: "Ayaan",
      age: 25,
      trigerWord: "Ayaan",
      tensorPath:
        "https://v3.fal.media/files/elephant/Rytb8czPtEcv4Mn1LwVp0_pytorch_lora_weights.safetensors",
      falAiRequest_id: "f5507360-232d-4340-93cc-3f050b5ce21c",
      zipUrl:
        "https://pub-eb32829f705f4084b8b957e333d06772.r2.dev/model/1746887818746_0.23176822642064332.zip",
      thumbnailUrl:
        "https://photoai.10xdev.one/model/1746909873696_0.19457614505421184.jpeg",
      userId: ctx.user.id, // dynamically passed in
      gender: Gender.Man,
      ethinicity: Ethinicity.South_Asian,
      status: Status.Success,
      eyeColor: EyeColor.Brown,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }),
  getModel: protectedProcedure
    .input(z.object({ name: z.string().default("") }))
    .query(async ({ ctx }) => {
      const models = await db
        .select()
        .from(model)
        .where(eq(model.userId, ctx.user.id));
      if (!models) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Models not found" });
      }
      return models;
    }),
  createModel: paidProcedure("model")
    .input(trainModelSchema)
    .mutation(async ({ input, ctx }) => {
      const { zipUrl, thumbNailUrl } = input;
      await db
        .update(user)
        .set({ token: sql`${user.token} -170` })
        .where(eq(user.id, ctx.user.id));

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
      const [createdModel] = await db
        .insert(model)
        .values({
          ...input,
          zipUrl: zipUrl!,
          thumbnailUrl: thumbNailUrl!,
          userId: ctx.user.id,
          falAiRequest_id: request_id,
        })
        .returning();
      return createdModel;
    }),
});
