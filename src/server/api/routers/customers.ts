import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "src/lib/db";
import { customersTable } from "~/lib/db/schema";
import { generateObjectId } from "~/lib/utils";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const customersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
        region: z.string().nonempty(),
        zone: z.string().nonempty(),
        phone: z.string().nonempty(),
        tinNumber: z.string().nonempty(),
        woreda: z.string().nonempty(),
        kebele: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const customerId = generateObjectId("customers");

        const result = await db
          .insert(customersTable)
          .values({ ...input, customerId })
          .returning();

        const customer = result[0];

        if (!customer) throw new Error("No customer was created");

        return { customer };
      } catch (e) {
        const err = e as Error;
        console.log("[ SERVER ]: Failed to create customer", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create customer: ${err.message}`,
        });
      }
    }),
  getList: protectedProcedure.query(async () => {
    try {
      const customers = await db
        .select()
        .from(customersTable)
        .where(sql`deleted_at IS NULL`)
        .orderBy(sql`created_at DESC`);

      return { customers };
    } catch (e) {
      const err = e as Error;
      console.log("[ SERVER ]: Failed to get customers", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get customers: ${err.message}`,
      });
    }
  }),
  get: protectedProcedure
    .input(z.object({ customerId: z.string().nonempty() }))
    .query(async ({ input }) => {
      try {
        const { customerId } = input;

        const customer = await db
          .select()
          .from(customersTable)
          .where(sql`customer_id = ${customerId} AND deleted_at IS NULL`);

        if (!customer) throw new Error("No customer was found");

        return { customer };
      } catch (e) {
        const err = e as Error;
        console.log("[ SERVER ]: Failed to get customer", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to get customer: ${err.message}`,
        });
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        name: z.string().nonempty(),
        region: z.string().nonempty(),
        zone: z.string().nonempty(),
        phone: z.string().nonempty(),
        tinNumber: z.string().nonempty(),
        woreda: z.string().nonempty(),
        kebele: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await db
          .update(customersTable)
          .set({ ...input })
          .where(sql`id = ${input.id} AND deleted_at IS NULL`)
          .returning();

        const customer = result[0];

        if (!customer) throw new Error("No customer was updated");

        return { customer };
      } catch (e) {
        const err = e as Error;
        console.log("[ SERVER ]: Failed to update customer", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update customer: ${err.message}`,
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ customerId: z.string().nonempty() }))
    .mutation(async ({ input }) => {
      try {
        const { customerId } = input;

        const result = await db
          .update(customersTable)
          .set({
            deletedAt: sql`NOW()`,
          })
          .where(sql`id = ${customerId} AND deleted_at IS NULL`)
          .returning();

        const customer = result[0];

        if (!customer) throw new Error("No customer was deleted");

        return { customer };
      } catch (e) {
        const err = e as Error;
        console.log("[ SERVER ]: Failed to delete customer", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete customer: ${err.message}`,
        });
      }
    }),
});
