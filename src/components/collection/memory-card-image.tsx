import Image from "next/image"

// utils
import { cn } from "@/lib/utils"

// icons
import { Circle } from "lucide-react"

type MemoryCardImageProps = {
  imageUrl: string | null
  imageSize?: number
  className?: string
}

const MemoryCardImage = ({ imageUrl, imageSize = 48, className }: MemoryCardImageProps) => {
  if (!imageUrl) {
    return (
      <Circle className={cn("p-1.5 text-muted-foreground bg-muted-foreground rounded-2xl transition-shadow img-wrapper hover:shadow-md", className)}
        size={imageSize}
      />
    )
  }

  return (
    <Image className={cn("rounded-2xl shadow-md transition-shadow img-wrapper hover:shadow-lg", className)}
      src={imageUrl}
      alt="card image"
      height={imageSize}
      width={imageSize}
    />
  )
}

export default MemoryCardImage
