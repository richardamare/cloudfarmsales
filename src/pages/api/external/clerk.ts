import { type WebhookEvent } from "@clerk/nextjs/api";
import { sql } from "drizzle-orm";
import { type NextApiRequest, type NextApiResponse } from "next";
import { db } from "src/lib/db";
import { usersTable } from "~/lib/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let code = 200;
  try {
    if (req.method !== "POST") {
      code = 405;
      throw Error("Invalid method");
    }

    const event = req.body as WebhookEvent;

    if (!event) {
      code = 400;
      throw Error("Invalid webhook event");
    }

    console.log("[ SERVER ]: Clerk webhook event", event);

    const userId = event.data.id;

    if (!userId) throw Error("Invalid user ID");

    switch (event.type) {
      case "user.created":
        await db.insert(usersTable).values({
          clerkId: userId,
          status: "waitlisted",
        });
        break;
      case "user.deleted":
        await db
          .update(usersTable)
          .set({ status: "disabled", deletedAt: new Date() })
          .where(sql`clerk_id = ${userId}`);
        break;
      default:
        throw Error("Unhandled webhook event");
    }

    return res.status(code).json({ message: "OK" });
  } catch (e) {
    const err = e as Error;
    console.log("[ SERVER ]: Failed to handle clerk webhook", err);
    return res.status(code).json({ error: err.message });
  }
}
