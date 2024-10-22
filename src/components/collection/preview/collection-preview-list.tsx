// utils
import { cn } from "@/lib/utils"

// components
import { CollectionPreviewItem } from "@/components/collection/preview"

type CollectionPreviewListProps = {
  files: File[]
  imageSize?: number
  className?: string
}

const CollectionPreviewList = ({ files, imageSize, className }: CollectionPreviewListProps) => {
  return (
    <ul className={cn("grid grid-cols-4 gap-4", className)}>
      {files.map((file) => (
        <li className="flex-1" key={file.name}>
          <CollectionPreviewItem
            file={file}
            imageSize={imageSize}
          />
        </li>
      ))}
    </ul>
  )
}

export default CollectionPreviewList
