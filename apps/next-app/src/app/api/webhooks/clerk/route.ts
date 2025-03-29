// clerk
import { WebhookEvent } from "@clerk/nextjs/server"

// api
import { userCreated, userDeleted, userUpdated, verifyWebhook } from "@/server/webhook/clerk"

export async function POST(req: Request) {
  let evt: WebhookEvent

  try {
    evt = await verifyWebhook(req)
  } catch (err) {
    return new Response((err as Error).message, { status: 400 })
  }

  const eventType = evt.type

  if (eventType === "user.created") {
    return userCreated(evt)
  }

  if (eventType === "user.updated") {
    return userUpdated(evt)
  }

  if (eventType === "user.deleted") {
    return userDeleted(evt)
  }

  return new Response('', { status: 200 })
}
