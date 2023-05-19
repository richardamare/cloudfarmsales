import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input, ctx }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
