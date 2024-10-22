// types
import type { UploadedFileData } from "uploadthing/types"

// server
import { signedIn } from "@/server/actions/signed-in"

// uploadthing
import { UploadThingError } from "uploadthing/server"

/**
 * TODO: write doc
 * 
 * @returns 
 */
export async function collectionMiddleware() {
  const user = await signedIn()
  if (!user) throw new UploadThingError('Unauthorized')

  // TODO: check if user already has a collection uploaded or not

  return { user }
}

type HandleUploadCompleteParams = {
  file: UploadedFileData
  metadata: Awaited<ReturnType<typeof collectionMiddleware>>
}

/**
 * TODO: write doc
 * 
 * @param
 * @returns 
 */
export async function handleCollectionUploadComplete({ file, metadata }: HandleUploadCompleteParams) {
  const { user } = metadata
  console.info(`[Uploadthing] Card collection uploaded by ${user.username} (${user.email})`)
  console.info({ file })

  // TODO: save card collection to db

  return { uploadedBy: user.username }
}

/**
 * TODO: write doc
 * 
 * @param fileCount 
 * @returns 
 */
export function getCollectionImageSettings(fileCount: number) {
  return {
    maxFileSize: "128KB",
    additionalProperties: {
      height: 256,
      width: 256
    },
    minFileCount: fileCount,
    maxFileCount: fileCount
  } as const
}
