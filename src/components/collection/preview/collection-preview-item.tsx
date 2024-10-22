"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// utils
import { cn } from "@/lib/utils"

type CollectionPreviewItemProps = {
  file: File
  imageSize?: number
  className?: string
}

const CollectionPreviewItem = ({ file, imageSize = 48, className }: CollectionPreviewItemProps) => {
  const [fileUrl, setFileUrl] = useState<string>('/') // TODO: add fallback placeholder asset

  useEffect(() => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      setFileUrl(e.target?.result as string)
    }
    fileReader.readAsDataURL(file)
  }, [])

  return (
    <Image className={cn("rounded-xl img-wrapper", className)}
      src={fileUrl}
      alt="card image"
      height={imageSize}
      width={imageSize}
    />
  )
}

export default CollectionPreviewItem
