"use client"

import { useCallback, useEffect, useState } from "react"

// types
import type { ExpandedRouteConfig } from "uploadthing/types"

// uploadthing
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client"
import { useDropzone } from "@uploadthing/react"

// utils
import { cn } from "@/lib/util"
import { generateFileUrls } from "@/lib/util/file"

// icons
import { ImageUp } from "lucide-react"

// copmponents
import { CollectionPreviewItem, CollectionPreviewList } from "@/components/collection"

type CollectionDropzoneProps = {
  files: File[]
  setFiles: (files: File[]) => void
  routeConfig?: ExpandedRouteConfig
  hidePreview?: boolean
  className?: string
}

const CollectionDropzone = ({ files, setFiles, routeConfig, hidePreview = false, className }: CollectionDropzoneProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const onDrop = useCallback(setFiles, [setFiles])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    )
  })

  useEffect(() => {
    if (hidePreview) return 

    (async () => {
      const urls = await generateFileUrls(files)
      setPreviewUrls(urls)
    })()
  }, [hidePreview, files, setPreviewUrls])

  const maxFileSize = routeConfig?.image?.maxFileSize
  const minFileCount = routeConfig?.image?.minFileCount
  const maxFileCount = routeConfig?.image?.maxFileCount

  return (
    <div className={cn("px-4 py-8 flex flex-col items-center justify-center text-center rounded-2xl border border-border/25 border-dashed cursor-pointer transition duration-200 hover:bg-transparent/5", className)}
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
            Selected <span className="font-bold">{files.length}</span> out of <span className="font-bold">{minFileCount}</span> images (Max. <span className="font-bold">{maxFileCount}</span> possible)
          </p>
        )}
      </div>

      {!hidePreview && (
        <CollectionPreviewList className={cn("justify-center", { "mt-4": files.length > 0 })} dense>
          {previewUrls.map((url) => (
            <CollectionPreviewItem className="-ml-2 first:-ml-2"
              imageUrl={url}
              imageSize={36}
              key={url}
              dense
            />
          ))}
        </CollectionPreviewList>
      )}
    </div>
  )
}

export default CollectionDropzone
