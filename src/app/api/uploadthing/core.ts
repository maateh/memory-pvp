// types
import type { FileRouter } from "uploadthing/next"

// uploadthing
import { createUploadthing } from "uploadthing/next"

// helpers
import {
  collectionMiddleware,
  getCollectionImageSettings,
  handleCollectionUploadComplete
} from "./_helpers/collection-helper"

const f = createUploadthing()

export const uploadRouter = {
  collectionSmall: f({ image: getCollectionImageSettings(8) })
    .middleware(collectionMiddleware)
    .onUploadComplete(handleCollectionUploadComplete),

  collectionMedium: f({ image: getCollectionImageSettings(12) })
    .middleware(collectionMiddleware)
    .onUploadComplete(handleCollectionUploadComplete),

  collectionLarge: f({ image: getCollectionImageSettings(18) })
    .middleware(collectionMiddleware)
    .onUploadComplete(handleCollectionUploadComplete)
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
