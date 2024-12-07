// uploadthing
import type { UploadRouter } from "@/server/uploadthing/core"
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react"

export const UploadButton = generateUploadButton<UploadRouter>()
export const UploadDropzone = generateUploadDropzone<UploadRouter>()
