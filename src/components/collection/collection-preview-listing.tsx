import Image from "next/image"

// icons
import { ImageIcon } from "lucide-react"

// utils
import { cn } from "@/lib/utils"

type CollectionCardPreviewProps = {
  imageUrl: string | null
  imageSize?: number
  className?: string
}

const CollectionCardPreview = ({ imageUrl, imageSize = 48, className }: CollectionCardPreviewProps) => {
  if (!imageUrl) {
    return (
      <ImageIcon className={cn("p-1.5 text-muted-foreground rounded-2xl transition-shadow img-wrapper hover:shadow-md", className)}
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

const CollectionPreviewList = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul className={cn("flex flex-wrap justify-around items-center gap-1.5", className)}
      {...props}
    />
  )
}

const CollectionPreviewDenseList = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul className={cn("flex flex-wrap items-center justify-center gap-y-2", className)}
      {...props}
    />
  )
}

type CollectionPreviewItemProps = {
  imageUrl: string | null
  imageSize?: number
} & React.ComponentProps<"li">

const CollectionPreviewItem = ({ imageUrl, imageSize, children, ...props }: CollectionPreviewItemProps) => {
  return (
    <li {...props}>
      {children || (
        <CollectionCardPreview
          imageUrl={imageUrl}
          imageSize={imageSize}
        />
      )}
    </li>
  )
}

const CollectionPreviewDenseItem = ({ imageUrl, imageSize, className, children, ...props }: CollectionPreviewItemProps) => {
  return (
    <li className={cn("relative -ml-2.5 first:ml-0 transition-all duration-500 ease-in-out hover:z-10 hover:-translate-y-2", className)}
      {...props}
    >
      {children || (
        <CollectionCardPreview
          imageUrl={imageUrl}
          imageSize={imageSize}
        />
      )}
    </li>
  )
}

export {
  CollectionCardPreview,
  CollectionPreviewList,
  CollectionPreviewItem,
  CollectionPreviewDenseList,
  CollectionPreviewDenseItem
}
