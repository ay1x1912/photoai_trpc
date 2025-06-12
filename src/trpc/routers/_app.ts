
import { imageRouter } from '@/modules/image/server/procedure';
import {  createTRPCRouter } from '../init';
import { modelRouter } from '@/modules/model/server/procedures';
export const appRouter = createTRPCRouter({
  model: modelRouter,
  image:imageRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;