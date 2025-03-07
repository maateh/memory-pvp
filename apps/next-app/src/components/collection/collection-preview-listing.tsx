// utils
import { cn } from "@/lib/util"

// components
import { MemoryCardImage } from "@/components/collection"

type CollectionPreviewListProps = {
  dense?: boolean
} & React.ComponentProps<"ul">

const CollectionPreviewList = ({ dense = false, className, ...props }: CollectionPreviewListProps) => {
  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", {
      "gap-x-0 gap-y-2": dense
    }, className)}
      {...props}
    />
  )
}

type CollectionPreviewItemProps = {
  imageUrl: string | null
  imageSize?: number
  dense?: boolean
} & React.ComponentProps<"li">

const CollectionPreviewItem = ({
  imageUrl,
  imageSize,
  dense = false,
  className,
  children,
  ...props
}: CollectionPreviewItemProps) => {
  return (
    <li className={cn({
      "relative -ml-2.5 first:ml-0 transition-all duration-500 ease-in-out hover:z-10 hover:scale-110 hover:-translate-y-2": dense
    }, className)}
      {...props}
    >
      {children || (
        <MemoryCardImage
          imageUrl={imageUrl}
          imageSize={imageSize}
        />
      )}
    </li>
  )
}

export { CollectionPreviewList, CollectionPreviewItem }
