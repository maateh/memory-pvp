import { Webhook } from "svix"

import { headers } from "next/headers"

// clerk
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server"

// prisma
import { db } from "@repo/server/db"

export async function verifyWebhook(req: Request): Promise<WebhookEvent> {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error('Error occured -- no svix headers')
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  // Verify the payload with the headers
  try {
    return wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    throw new Error('Error occured')
  }
}

export async function userCreated(evt: WebhookEvent) {
  if (evt.type !== 'user.created') {
    return new Response('Bad request', { status: 400 })
  }

  const { id, email_addresses, username, image_url } = evt.data

  const user = await db.user.create({
    data: {
      clerkId: id,
      username: email_addresses[0].email_address,
      email: username!,
      imageUrl: image_url
    }
  })

  if (user) {
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        userId: user.id
      }
    })
  }

  return new Response('User created', { status: 201 })
}

export async function userUpdated(evt: WebhookEvent) {
  if (evt.type !== 'user.updated') {
    return new Response('Bad request', { status: 400 })
  }

  const { id, email_addresses, username, image_url } = evt.data

  await db.user.update({
    where: {
      clerkId: id
    },
    data: {
      username: username!,
      email: email_addresses[0].email_address,
      imageUrl: image_url
    }
  })

  return new Response('User updated', { status: 201 })
}

export async function userDeleted(evt: WebhookEvent) {
  if (evt.type !== 'user.deleted') {
    return new Response('Bad request', { status: 400 })
  }

  const { id } = evt.data

  if (!id) {
    return new Response('User ID missing', { status: 404 })
  }

  await db.user.delete({
    where: {
      clerkId: id
    }
  })

  return new Response('User deleted', { status: 200 })
}
