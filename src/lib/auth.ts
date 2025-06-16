import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db";
import * as schema from "@/db/schema";
import { polarClient } from "./polar";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { WebhookOrderPaidPayload } from "@polar-sh/sdk/models/components/webhookorderpaidpayload.js";
import { eq, sql } from "drizzle-orm";

export const auth = betterAuth({
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          authenticatedUsersOnly: true,
          successUrl: "/purchase",
        }),
        portal(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          
          onOrderPaid: async (payload: WebhookOrderPaidPayload) => {
            if (payload.data.paid) {
              console.log(payload.data);
              await db
                .update(schema.user)
                .set({ token: sql`${schema.user.token} + 10` })
                .where(eq(schema.user.id, payload.data.customer.externalId as string));
            }
          },
        }),
      ],
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite",
    schema: {
      ...schema,
    },
  }),
});
