import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "~/env.mjs";

const connectionString = () => {
  // if (env.NODE_ENV === "production") {
  return env.POSTGRES_URL + "?sslmode=require";
  // }

  // return env.POSTGRES_URL;
};

const pool = new Pool({
  connectionString: connectionString(),
});

export const db = drizzle(pool);
