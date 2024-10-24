// prisma
import type { CardCollection } from "@prisma/client"

// components
import { CollectionPreviewDenseList, CollectionPreviewItem } from "@/components/collection"
import { WidgetCard, WidgetSubheader } from "@/components/widgets"

type CollectionWidgetCardProps = {
  collection: CardCollection
  className?: string
}

const CollectionWidgetCard = ({ collection, className }: CollectionWidgetCardProps) => {
  const { name, description, userId } = collection

  return (
    <WidgetCard className={className}
      title={name}
      description={description}
    >
      <WidgetSubheader className="font-normal">
        {/* TODO: GET -> user(name) with collection */}
        Created by <span className="text-accent font-semibold">{userId}</span>
      </WidgetSubheader>

      <CollectionPreviewDenseList>
        {/* TODO: GET -> collection cards */}
        {/* {collection.cards.map((card) => (
          <CollectionPreviewItem
            imageUrl={card.imageUrl}
            imageSize={40}
            key={card.id}
          />
        ))} */}
      </CollectionPreviewDenseList>
    </WidgetCard>
  )
}

export default CollectionWidgetCard
