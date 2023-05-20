import { type WebhookEvent } from "@clerk/nextjs/api";
import { DrizzleError } from "drizzle-orm";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const event = request.body as WebhookEvent;

  console.log("[ SERVER ]: Clerk event received", event);

  try {
    switch (event.type) {
      case "user.created":
        break;
    }

    return response.status(200).json({ success: true });
  } catch (e) {
    const err = e as Error;
    console.log("[ SERVER ]: Failed to create event", err);

    if (err instanceof z.ZodError) {
      return response.status(400).json({ error: err.flatten() });
    }

    if (err instanceof DrizzleError) {
      return response.status(400).json({ error: err.message });
    }

    return response.status(500).json({ error: err.message });
  }
}
