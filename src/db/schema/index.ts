import { type InferModel } from "drizzle-orm";
import {
  foreignKey,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const customersTable = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: text("customer_id").notNull(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  zone: text("zone").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type Customer = InferModel<typeof customersTable, "select">;

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
    currency: text("currency").notNull(),
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

export type SaleWithCustomer = Sale & {
  customer: Omit<Customer, "createdAt" | "updatedAt" | "deletedAt">;
};
