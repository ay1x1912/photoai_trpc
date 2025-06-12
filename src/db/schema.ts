import { enumToPgEnum, Status } from "@/modules/image/type";
import { Ethinicity, EyeColor, Gender} from "@/modules/model/types";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const eyeColor = pgEnum("eyeColor", enumToPgEnum(EyeColor));
export const gender = pgEnum("gender", enumToPgEnum(Gender));
export const ethinicity = pgEnum("ethinicity", enumToPgEnum(Ethinicity));
export const status = pgEnum("status", enumToPgEnum(Status));
export const model = pgTable("model", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  trigerWord: text("trigerWord"),
  tensorPath: text("tensorPath"),
  falAiRequest_id: text("falAiRequest_id"),
  zipUrl: text("zipUrl").notNull(),
  thumbnailUrl: text("thumbnailUr"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  gender: gender("gender").notNull(),
  ethinicity: ethinicity("ethinicity").notNull(),
  status: status("status").notNull().default(Status.Pending),
  eyeColor: eyeColor("eyeColor").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});



export const outputImage = pgTable("outputImage", {
  id: text("id")
  .primaryKey()
    .$defaultFn(() => nanoid()),
  imageUrl: text("imageUrl").notNull(),
  prompt: text("prompt").notNull(),
  styles:text("styles"),
  userId: text("user_id")
  .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  modelId: text("model_id")
    .notNull()
    .references(() => model.id, { onDelete: "set null" }),
  falAiRequest_id: text("falAiRequest_id"),
  status: status("status").notNull().default(Status.Pending),
  createdAt: timestamp("created_at")
  .$defaultFn(() => /* @__PURE__ */ new Date())
  .notNull(),
updatedAt: timestamp("updated_at")
  .$defaultFn(() => /* @__PURE__ */ new Date())
  .notNull(),
})