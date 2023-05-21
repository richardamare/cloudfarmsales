import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import { customersTable, salesTable } from "~/db/schema";
import { generateObjectId } from "~/lib/utils";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const salesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        customerId: z.string().nonempty(),
        docQuantity: z.number().int().positive(),
        docUnitPrice: z
          .number()
          .int()
          .positive()
          .transform((v) => v * 100),
        docDeliveredQuantity: z.number().int().positive(),
        feedAmount: z.number().int().positive(),
        feedUnitPrice: z
          .number()
          .int()
          .positive()
          .transform((v) => v * 100),
        paymentStatus: z.enum(["pending", "paid", "partial", "deposit"]),
        soldAt: z.date().transform((v) => {
          // convert to UTC
          return new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()));
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const saleId = generateObjectId("sales");

        const customer = (
          await db
            .select()
            .from(customersTable)
            .where(eq(customersTable.id, input.customerId))
            .limit(1)
        )[0];

        if (!customer) throw Error("Customer not found");

        const sale = (
          await db
            .insert(salesTable)
            .values({ ...input, saleId })
            .returning()
        )[0];

        if (!sale) throw Error("No sale was created");

        return { sale };
      } catch (e) {
        const err = e as Error;
        console.log("[ SERVER ]: Failed to create sales", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create sales: ${err.message}`,
        });
      }
    }),
  getList: protectedProcedure.query(async () => {
    try {
      const result = await db.execute<{
        id: string;
        saleId: string;
        customerId: string;
        docQuantity: number;
        docUnitPrice: number;
        docDeliveredQuantity: number;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        deletedAt: Date | null;
        feedAmount: number;
        feedUnitPrice: number;
        paymentStatus: string;
        soldAt: Date;
        doc: {
          total: number;
          remaining: number;
        };
        customer: {
          id: string;
          customerId: string;
          name: string;
          region: string;
          zone: string;
          phone: string;
        };
      }>(sql`
        SELECT
          sales.id AS id,
          sales.sale_id AS "saleId",
          sales.customer_id AS "customerId",
          sales.doc_quantity AS "docQuantity",
          sales.doc_unit_price AS "docUnitPrice",
          sales.doc_delivered_quantity AS "docDeliveredQuantity",
          sales.created_at AS "createdAt",
          sales.updated_at AS "updatedAt",
          sales.deleted_at AS "deletedAt",
          sales.feed_amount AS "feedAmount",
          sales.feed_unit_price AS "feedUnitPrice",
          sales.payment_status AS "paymentStatus",
          sales.sold_at AS "soldAt",
          doc_quantity * doc_unit_price AS total,
          json_build_object(
            'total', doc_quantity,
            'remaining', doc_quantity - doc_delivered_quantity
          ) as doc,
          json_build_object(
            'id', customers.id,
            'customerId', customers.customer_id,
            'name', customers.name,
            'region', customers.region,
            'zone', customers.zone,
            'phone', customers.phone
          ) AS customer
        FROM sales
        INNER JOIN customers ON sales.customer_id = customers.id
        WHERE sales.deleted_at IS NULL
        ORDER BY sales.created_at DESC
      `);

      return { sales: result.rows };
    } catch (e) {
      const err = e as Error;
      console.log("[ SERVER ]: Failed to get sales", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get sales: ${err.message}`,
      });
    }
  }),
  get: protectedProcedure
    .input(
      z.object({
        saleId: z.string().nonempty(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { saleId } = input;

        const sale = (
          await db
            .select()
            .from(salesTable)
            .where(eq(salesTable.id, saleId))
            .limit(1)
        )[0];

        if (!sale) throw Error("Sale not found");

        return { sale };
      } catch (e) {
        const err = e as Error;
        console.log("[ SERVER ]: Failed to get sales", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to get sales: ${err.message}`,
        });
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        customerId: z.string().nonempty(),
        docQuantity: z.number().int().positive(),
        docUnitPrice: z
          .number()
          .int()
          .positive()
          .transform((v) => v * 100),
        docDeliveredQuantity: z.number().int().positive(),
        feedAmount: z.number().int().positive(),
        feedUnitPrice: z
          .number()
          .int()
          .positive()
          .transform((v) => v * 100),
        paymentStatus: z.enum(["pending", "paid", "partial", "deposit"]),
        soldAt: z.date().transform((v) => {
          // convert to UTC
          return new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()));
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const sale = (
          await db
            .select()
            .from(salesTable)
            .where(eq(salesTable.id, input.id))
            .limit(1)
        )[0];

        if (!sale) throw Error("Sale not found");

        const updatedSale = (
          await db
            .update(salesTable)
            .set({ ...input })
            .where(eq(salesTable.id, input.id))
            .returning()
        )[0];

        if (!updatedSale) throw Error("No sale was updated");

        return { sale: updatedSale };
      } catch (e) {
        const err = e as Error;
        console.log("[ SERVER ]: Failed to update sales", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update sales: ${err.message}`,
        });
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        saleId: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const sale = (
          await db
            .select()
            .from(salesTable)
            .where(eq(salesTable.id, input.saleId))
            .limit(1)
        )[0];

        if (!sale) throw Error("Sale not found");

        const deletedSale = (
          await db
            .delete(salesTable)
            .where(eq(salesTable.id, input.saleId))
            .returning()
        )[0];

        if (!deletedSale) throw Error("No sale was deleted");

        return { sale: deletedSale };
      } catch (e) {
        const err = e as Error;
        console.log("[ SERVER ]: Failed to delete sales", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete sales: ${err.message}`,
        });
      }
    }),
});
