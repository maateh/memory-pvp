// types
import type { z } from "zod"
import type { FileRouter } from "uploadthing/next"

// uploadthing
import { createUploadthing } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/user-action"

// config
import { getCollectionImageSettings } from "@/config/collection-settings"

// validations
import { createCollectionUtSchema } from "@/lib/schema/validation/collection-validation"

/** Middleware to limit the number of card collections that can be created by users. */
async function collectionLimitMiddleware({ input }: { input: z.infer<typeof createCollectionUtSchema> }) {
  const user = await signedIn()
  if (!user) {
    throw new UploadThingError({
      code: "FORBIDDEN",
      message: 'You are not signed in to your account.'
    })
  }

  const collections = await db.cardCollection.count({
    where: {
      userId: user.id
    }
  })

  if (collections >= 1) {
    throw new UploadThingError({
      code: "FILE_LIMIT_EXCEEDED",
      message: "Collection limit reached."
    })
  }

  return { user, input }
}

const f = createUploadthing()

export const uploadRouter = {
  collectionSmall: f({ image: getCollectionImageSettings('SMALL') })
    .input(createCollectionUtSchema)
    .middleware(collectionLimitMiddleware)
    .onUploadComplete(({ metadata }) => {
      const { user, input } = metadata
      console.info(`[Uploadthing] Collection card (${input.tableSize}) uploaded by ${user.username} (${user.email})`)
    }),

  collectionMedium: f({ image: getCollectionImageSettings('MEDIUM') })
    .input(createCollectionUtSchema)
    .middleware(collectionLimitMiddleware)
    .onUploadComplete(({ metadata }) => {
      const { user, input } = metadata
      console.info(`[Uploadthing] Collection card (${input.tableSize}) uploaded by ${user.username} (${user.email})`)
    }),

  collectionLarge: f({ image: getCollectionImageSettings('LARGE') })
    .input(createCollectionUtSchema)
    .middleware(collectionLimitMiddleware)
    .onUploadComplete(({ metadata }) => {
      const { user, input } = metadata
      console.info(`[Uploadthing] Collection card (${input.tableSize}) uploaded by ${user.username} (${user.email})`)
    })
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
export type { collectionLimitMiddleware }
