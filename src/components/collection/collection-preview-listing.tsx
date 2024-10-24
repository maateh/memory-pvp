// utils
import { cn } from "@/lib/utils"

// components
import { CollectionCardPreview } from "@/components/collection"

const CollectionPreviewList = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul className={cn("grid grid-cols-4 gap-4", className)}
      {...props}
    />
  )
}

const CollectionPreviewDenseList = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul className={cn("flex flex-wrap items-center justify-center", className)}
      {...props}
    />
  )
}

type CollectionPreviewItemProps = {
  imageUrl: string | null
  imageSize?: number
  parentClassName?: string
} & React.ComponentProps<"li">

const CollectionPreviewItem = ({ imageUrl, imageSize, className, parentClassName, ...props }: CollectionPreviewItemProps) => {
  return (
    <li className={parentClassName} {...props}>
      <CollectionCardPreview className={className}
        imageUrl={imageUrl}
        imageSize={imageSize}
      />
    </li>
  )
}

const CollectionPreviewDenseItem = ({ imageUrl, imageSize, className, parentClassName, ...props }: CollectionPreviewItemProps) => {
  return (
    <li className={cn("relative -ml-4 first:ml-0 transition-all duration-300 ease-in-out hover:z-10 hover:-translate-y-2", parentClassName)}
      {...props}
    >
      <CollectionCardPreview className={cn("duration-300 ease-in-out", className)}
        imageUrl={imageUrl}
        imageSize={imageSize}
      />
    </li>
  )
}

export {
  CollectionPreviewList,
  CollectionPreviewItem,
  CollectionPreviewDenseList,
  CollectionPreviewDenseItem
}
