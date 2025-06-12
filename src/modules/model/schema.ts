import {z}  from"zod"
import { Ethinicity, EyeColor, Gender } from "./types";
export const trainModelSchema = z.object({
  name: z.string().min(1),
  age: z.number(),
  gender: z.nativeEnum(Gender),
  ethinicity: z.nativeEnum(Ethinicity),
  eyeColor: z.nativeEnum(EyeColor),
  zipUrl: z.string().optional(),
  thumbNailUrl:z.string().optional()
});