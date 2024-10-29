// utils
import { cn } from "@/lib/utils"

// components
import { CollectionAccordionWidgetCard } from "@/components/collection/widget"

type CollectionWidgetListProps = ({
  collections: ClientCardCollection[]
  children?: never
} | {
  collections?: never
  children: React.ReactNode
}) & Omit<React.ComponentProps<"ul">, 'children'>

const CollectionWidgetList = ({ collections, className, children, ...props }: CollectionWidgetListProps) => {
  return (
    <ul className={cn("grid gap-x-10 gap-y-8 xl:grid-cols-2 2xl:grid-cols-3", className)}
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
      {collection ? <CollectionAccordionWidgetCard collection={collection} /> : children}
    </li>
  )
}

export {
  CollectionWidgetList,
  CollectionWidgetItem
}
