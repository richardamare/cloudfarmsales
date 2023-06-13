import { type InferModel } from "drizzle-orm";
import {
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { type RouterOutputs } from "../../api";

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "disabled",
  "waitlisted",
]);

const userStatusSchema = z.enum(userStatusEnum.enumValues);

export const userStatuses = userStatusEnum.enumValues;

export type UserStatus = z.infer<typeof userStatusSchema>;

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull(),
  status: userStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type User = InferModel<typeof usersTable, "select">;

export const customersTable = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: text("customer_id").notNull(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  zone: text("zone").notNull(),
  phone: text("phone").notNull(),
  tinNumber: text("tin_number").notNull(),
  woreda: text("woreda").notNull(),
  kebele: text("kebele").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type Customer = InferModel<typeof customersTable, "select">;

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "partial",
  "deposit",
]);

const paymentStatusSchema = z.enum(paymentStatusEnum.enumValues);

export const paymenStatuses = paymentStatusEnum.enumValues;

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const salesTable = pgTable(
  "sales",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    saleId: text("sale_id").notNull(),
    customerId: uuid("customer_id")
      .references(() => customersTable.id)
      .notNull(),
    docQuantity: integer("doc_quantity").notNull(),
    docUnitPrice: integer("doc_unit_price").notNull(),
    docDeliveredQuantity: integer("doc_delivered_quantity").notNull(),
    docBreedType: text("doc_breed_type").notNull(),
    feedAmount: integer("feed_amount").notNull(),
    feedUnitPrice: integer("feed_unit_price").notNull(),
    feedType: text("feed_type").notNull(),
    vaccineDoses: integer("vaccine_doses").notNull(),
    vaccineUnitPrice: integer("vaccine_unit_price").notNull(),
    vaccineType: text("vaccine_type").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").notNull(),
    soldAt: timestamp("sold_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (sales) => {
    return {
      customer: foreignKey({
        columns: [sales.customerId],
        foreignColumns: [customersTable.id],
      }),
    };
  }
);

export type Sale = InferModel<typeof salesTable, "select">;

export type SaleWithCustomer =
  RouterOutputs["sales"]["getList"]["sales"][number];
