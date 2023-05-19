import { createTRPCRouter } from "~/server/api/trpc";
import { customersRouter } from "./routers/customers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customers: customersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
