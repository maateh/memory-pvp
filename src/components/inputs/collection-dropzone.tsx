"use client"

import { useCallback, useState } from "react"

// types
import type { UploadRouter } from "@/app/api/uploadthing/core"

// uploadthing
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client"
import { useDropzone } from "@uploadthing/react"

// utils
import { cn, generateFileUrls } from "@/lib/utils"

// icons
import { ImagePlus, ImageUp } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// copmponents
import { CollectionPreviewDenseItem, CollectionPreviewDenseList } from "@/components/collection"

// hooks
import { useUploadThing } from "@/hooks/use-upload-thing"

type CollectionDropzoneProps = {
  files: File[]
  setFiles: (files: File[]) => void
  endpoint: keyof UploadRouter
  hidePreview?: boolean
  hideUploadButton?: boolean
  className?: string
}

const CollectionDropzone = ({
  files, setFiles, endpoint,
  hidePreview = false, hideUploadButton = false,
  className
}: CollectionDropzoneProps) => {
  const [fileUrls, setFileUrls] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!hidePreview) {
      const urls = await generateFileUrls(acceptedFiles)
      setFileUrls(urls)
    }

    setFiles(acceptedFiles)
  }, [setFiles, hidePreview])

  const { startUpload, routeConfig, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: () => {
      console.info("files uploaded successfully")
    },
    onUploadError: () => {
      console.error("error occurred while uploading")
    },
    onUploadBegin: (fileName) => {
      console.info("upload has begun for: ", fileName)
    }
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    )
  })

  const maxFileSize = routeConfig?.image?.maxFileSize
  const minFileCount = routeConfig?.image?.minFileCount

  return (
    <div className={cn("px-4 py-8 flex flex-col items-center justify-center text-center rounded-2xl border border-input/50 border-dashed cursor-pointer", className)}
      {...getRootProps()}
    >
      <ImageUp className="size-6 mx-auto text-accent sm:size-8" />

      <label className="mt-4 text-xs text-muted-foreground leading-6 sm:text-sm">
        <input {...getInputProps()} />
        Choose image(s) or drag and drop
      </label>

      <div className="mt-1 text-muted-foreground text-xs font-light dark:font-extralight tracking-wide">
        {maxFileSize && (
          <p className="leading-6">
            Maximum image size: <span className="font-semibold">{maxFileSize}</span>
          </p>
        )}

        {minFileCount && (
          <p>
            Selected <span className="font-bold">{files.length}</span> out of <span className="font-bold">{minFileCount}</span> images
          </p>
        )}
      </div>

      <CollectionPreviewDenseList className={cn({ "mt-4": files.length > 0, "hidden": hidePreview })}>
        {fileUrls.map((url) => (
          <CollectionPreviewDenseItem
            imageUrl={url}
            key={url}
          />
        ))}
      </CollectionPreviewDenseList>

      <Button className={cn("mt-4 gap-x-2", { "hidden": hideUploadButton })}
        variant="secondary"
        size="sm"
        onClick={() => startUpload(files)}
        disabled={isUploading || files.length !== minFileCount}
      >
        <ImagePlus className="size-3.5 sm:size-4" />
        <span>Upload collection</span>
      </Button>
    </div>
  )
}

export default CollectionDropzone
