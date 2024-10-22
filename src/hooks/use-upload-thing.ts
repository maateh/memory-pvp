// types
import type { UploadRouter } from "@/app/api/uploadthing/core"

// uploadthing
import { generateReactHelpers } from "@uploadthing/react"

export const { useUploadThing, uploadFiles } = generateReactHelpers<UploadRouter>()
