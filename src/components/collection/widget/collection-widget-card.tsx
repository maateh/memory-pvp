// utils
import { cn } from "@/lib/utils"

// shadcn
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// components
import {
  CollectionPreviewDenseItem,
  CollectionPreviewDenseList,
  CollectionPreviewItem,
  CollectionPreviewList
} from "@/components/collection"

type CollectionWidgetCardHeaderProps = {
  collection: ClientCardCollection
  previewImageSize?: number
  withPreview?: boolean
} & React.ComponentProps<typeof CardHeader>

const CollectionWidgetCardHeader = ({ collection, previewImageSize, withPreview = false, className, ...props }: CollectionWidgetCardHeaderProps) => {
  return (
    <CardHeader className={cn("p-0", className)} {...props}>
      <div className="flex items-center gap-x-3">
        <Separator className="w-2 h-5 bg-accent rounded-full sm:h-6"
          orientation="vertical"
        />

        <CardTitle className="mt-1 text-xl sm:text-xl font-heading tracking-wide text-start break-all">
          {collection.name}
        </CardTitle>
      </div>

      <CardDescription className="w-fit font-extralight text-sm text-start break-all">
        {collection.description}
      </CardDescription>

      {withPreview && (
        <CollectionPreviewDenseList className="pt-2 justify-start group-data-[state=open]:hidden">
          {collection.cards.map((card) => (
            <CollectionPreviewDenseItem className="-ml-2 first:-ml-2"
              imageUrl={card.imageUrl}
              imageSize={previewImageSize}
              key={card.id}
            />
          ))}
        </CollectionPreviewDenseList>
      )}
    </CardHeader>
  )
}

type CollectionWidgetCardContentProps = {
  collection: ClientCardCollection
  imageSize?: number
} & React.ComponentProps<typeof CardContent>

const CollectionWidgetCardContent = ({ collection, imageSize, ...props }: CollectionWidgetCardContentProps) => {
  return (
    <CardContent {...props}>
      <CollectionPreviewList>
        {collection.cards.map((card) => (
          <CollectionPreviewItem
            imageUrl={card.imageUrl}
            imageSize={imageSize}
            key={card.id}
          />
        ))}
      </CollectionPreviewList>
    </CardContent>
  )
}

type CollectionWidgetCardProps = {
  collection: ClientCardCollection
  imageSize?: number
} & React.ComponentProps<typeof Card>

const CollectionWidgetCard = ({
  collection,
  imageSize = 56,
  className, ...props
}: CollectionWidgetCardProps) => {
  return (
    <Card className={cn("bg-primary/60 py-0 px-5", className)} {...props}>
      <CollectionWidgetCardHeader className="pt-2"
        collection={collection}
      />

      <CollectionWidgetCardContent className="px-1.5 pt-4 pb-2.5"
        imageSize={imageSize}
        collection={collection}
      />
    </Card>
  )
}

type CollectionAccordionWidgetCardProps = {
  previewImageSize?: number
} & CollectionWidgetCardProps

const CollectionAccordionWidgetCard = ({
  collection,
  imageSize = 56,
  previewImageSize = 24,
  className, ...props
}: CollectionAccordionWidgetCardProps) => {
  return (
    <Card className={cn("bg-primary/60 py-2.5 px-2", className)} {...props}>
      <Accordion type="single" collapsible>
        <AccordionItem className="group border-t-0" value="collection-images">
          <AccordionTrigger className="w-fit py-0 group-data-[state=open]:pt-2" iconProps={{ className: "size-8", strokeWidth: 4 }}>
            <CollectionWidgetCardHeader
              previewImageSize={previewImageSize}
              collection={collection}
              withPreview
            />
          </AccordionTrigger>

          <AccordionContent className="p-0">
            <CollectionWidgetCardContent className="px-1.5 pt-4 pb-2.5"
              imageSize={imageSize}
              collection={collection}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export {
  CollectionWidgetCard,
  CollectionAccordionWidgetCard
}
