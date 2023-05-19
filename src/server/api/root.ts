import { customersRouter } from "~/server/api/routers/customers";
import { reportsRouter } from "~/server/api/routers/reports";
import { salesRouter } from "~/server/api/routers/sales";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customers: customersRouter,
  sales: salesRouter,
  reports: reportsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
