
import { imageRouter } from '@/modules/image/server/procedure';
import {  createTRPCRouter } from '../init';
import { modelRouter } from '@/modules/model/server/procedures';
import { tokenRouter } from '@/modules/token/server/procedure';
import { orderRouter } from '@/modules/order/server/procedure';
export const appRouter = createTRPCRouter({
  model: modelRouter,
  image: imageRouter,
  token: tokenRouter,
  order:orderRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;