import Image from "next/image"

// utils
import { cn } from "@/lib/utils"

// icons
import { ImageIcon } from "lucide-react"

type CollectionCardPreviewProps = {
  imageUrl: string | null
  imageSize?: number
  className?: string
}

const CollectionCardPreview = ({ imageUrl, imageSize = 48, className }: CollectionCardPreviewProps) => {
  if (!imageUrl) {
    return (
      <ImageIcon className={cn("rounded-xl shadow-md transition-shadow img-wrapper hover:shadow-lg", className)} />
    )
  }

  return (
    <Image className={cn("rounded-xl shadow-md transition-shadow img-wrapper hover:shadow-lg", className)}
      src={imageUrl}
      alt="card image"
      height={imageSize}
      width={imageSize}
    />
  )
}

export default CollectionCardPreview
