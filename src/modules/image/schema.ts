import {z} from "zod"
export const GenerateImageFromPrompt = z.object({
  prompt: z.string(),
  modelId: z.string(),
  styles:z.string().optional()
});
