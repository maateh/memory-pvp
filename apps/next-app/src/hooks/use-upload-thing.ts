// types
import type { UploadRouter } from "@/server/uploadthing/core"

// uploadthing
import { generateReactHelpers } from "@uploadthing/react"

export const { useUploadThing, uploadFiles } = generateReactHelpers<UploadRouter>()
