import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";
import { type GetServerSideProps } from "next";
import { db } from "src/lib/db";
import { usersTable } from "~/lib/db/schema";

export const handleAuthorisation: GetServerSideProps = async (ctx) => {
  try {
    const { userId } = getAuth(ctx.req);
    if (userId) {
      const persistedUser = (
        await db
          .select()
          .from(usersTable)
          .where(sql`clerk_id = ${userId} AND deleted_at IS NULL`)
          .limit(1)
      )[0];

      if (!persistedUser) throw Error("User not found");

      if (persistedUser.status !== "active")
        throw Error("Your account is not active. Please contact support.");
    }
    return { props: { ...buildClerkProps(ctx.req) } };
  } catch (e) {
    const error = e as Error;
    console.error("[ SERVER ]: Failed to handle authorisation", error);
    return {
      redirect: {
        destination: `/?error=${error.message}`,
        permanent: false,
      },
    };
  }
};
