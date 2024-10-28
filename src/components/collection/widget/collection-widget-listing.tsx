// utils
import { cn } from "@/lib/utils"

// components
import { CollectionWidgetCard } from "@/components/collection"

type CollectionWidgetListProps = ({
  collections: ClientCardCollection[]
  children?: never
} | {
  collections?: never
  children: React.ReactNode
}) & Omit<React.ComponentProps<"ul">, 'children'>

const CollectionWidgetList = ({ collections, className, children, ...props }: CollectionWidgetListProps) => {
  return (
    <ul className={cn("widget-container 2xl:grid-cols-3", className)}
      {...props}
    >
      {children || collections?.map((collection) => (
        <CollectionWidgetItem
          collection={collection}
          key={collection.id}
        />
      ))}
    </ul>
  )
}

type CollectionWidgetItemProps = ({
  collection: ClientCardCollection
  children?: never
} | {
  collection?: never
  children: React.ReactNode
}) & Omit<React.ComponentProps<"li">, 'children'>

const CollectionWidgetItem = ({ collection, children, ...props }: CollectionWidgetItemProps) => {
  return (
    <li {...props}
    >
      {collection ? <CollectionWidgetCard collection={collection} /> : children}
    </li>
  )
}

export {
  CollectionWidgetList,
  CollectionWidgetItem
}
