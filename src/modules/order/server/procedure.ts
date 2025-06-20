import {
  createTRPCRouter,

  protectedProcedure,
} from "@/trpc/init";
import {z} from "zod"
export const orderRouter = createTRPCRouter({
    createOrder: protectedProcedure.input(z.object({
     phoneNumber:z. 
    })).mutation(() => {
        
    })
})