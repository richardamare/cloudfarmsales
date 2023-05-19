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
        docUnitPrice: z.number().int().positive(),
        docDeliveredQuantity: z.number().int().positive(),
        currency: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const {
          customerId,
          docQuantity,
          docUnitPrice,
          docDeliveredQuantity,
          currency,
        } = input;

        const saleId = generateObjectId("sales");

        const customer = (
          await db
            .select()
            .from(customersTable)
            .where(eq(customersTable.id, customerId))
            .limit(1)
        )[0];

        if (!customer) throw Error("Customer not found");

        const sale = (
          await db
            .insert(salesTable)
            .values({
              saleId,
              customerId,
              docQuantity,
              docUnitPrice,
              docDeliveredQuantity,
              currency,
            })
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
      const sales = await db
        .select()
        .from(salesTable)
        .where(sql`deleted_at IS NULL`)
        .orderBy(sql`created_at DESC`);

      return { sales };
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
            .where(eq(salesTable.saleId, saleId))
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
        saleId: z.string().nonempty(),
        docQuantity: z.number().int().positive(),
        docUnitPrice: z.number().int().positive(),
        docDeliveredQuantity: z.number().int().positive(),
        currency: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const {
          saleId,
          docQuantity,
          docUnitPrice,
          docDeliveredQuantity,
          currency,
        } = input;

        const sale = (
          await db
            .select()
            .from(salesTable)
            .where(eq(salesTable.saleId, saleId))
            .limit(1)
        )[0];

        if (!sale) throw Error("Sale not found");

        const updatedSale = (
          await db
            .update(salesTable)
            .set({
              docQuantity,
              docUnitPrice,
              docDeliveredQuantity,
              currency,
            })
            .where(eq(salesTable.saleId, saleId))
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
        const { saleId } = input;

        const sale = (
          await db
            .select()
            .from(salesTable)
            .where(eq(salesTable.saleId, saleId))
            .limit(1)
        )[0];

        if (!sale) throw Error("Sale not found");

        const deletedSale = (
          await db
            .delete(salesTable)
            .where(eq(salesTable.saleId, saleId))
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
