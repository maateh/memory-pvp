import Image from "next/image"

// utils
import { cn } from "@/lib/util"

// icons
import { CircleSlash } from "lucide-react"

// components
import { CustomTooltip } from "@/components/shared"

type MemoryCardImageProps = {
  imageUrl: string | null
  imageSize?: number
  className?: string
}

const MemoryCardImage = ({ imageUrl, imageSize = 48, className }: MemoryCardImageProps) => {
  if (!imageUrl) {
    return (
      <CustomTooltip
        tooltipProps={{ className: "text-xs text-muted-foreground border-border/40" }}
        tooltip="Unable to load."
      >
        <CircleSlash className={cn("p-1.5 text-muted-foreground/25 bg-muted rounded-2xl transition-shadow img-wrapper hover:shadow-md", className)}
          size={imageSize}
        />
      </CustomTooltip>
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
