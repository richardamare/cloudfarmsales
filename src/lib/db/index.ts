import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { env } from "~/env.mjs";

const connectionString = () => {
  // if (env.NODE_ENV === "production") {
  return env.POSTGRES_URL + "?sslmode=require";
  // }

  // return env.POSTGRES_URL;
};

export const db = drizzle(sql);
