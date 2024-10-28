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

type CollectionWidgetCardProps = {
  collection: ClientCardCollection
} & React.ComponentProps<typeof Card>

const CollectionWidgetCard = ({ collection, className, ...props }: CollectionWidgetCardProps) => {
  return (
    <Card className={cn("bg-primary/60 py-2.5 px-2", className)} {...props}>
      <Accordion type="single" collapsible>
        <AccordionItem className="group border-t-0" value="collection-preview">
          <AccordionTrigger className="py-0 group-data-[state=open]:pt-2" iconProps={{ className: "size-8", strokeWidth: 4 }}>
            <CardHeader className="p-0">
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-x-3">
                  <Separator className="w-2 h-5 bg-accent rounded-full sm:h-6"
                    orientation="vertical"
                  />

                  <CardTitle className="mt-1 text-xl sm:text-xl font-heading tracking-wide">
                    {collection.name}
                  </CardTitle>
                </div>
              </div>

              <CardDescription className="font-extralight text-sm text-start">
                {collection.description}
              </CardDescription>

              <CollectionPreviewDenseList className="pt-2 justify-start group-data-[state=open]:hidden">
                {[...collection.cards,...collection.cards].map((card) => (
                  <CollectionPreviewDenseItem className="-ml-2 first:-ml-2"
                    imageUrl={card.imageUrl}
                    imageSize={24}
                    key={card.id}
                  />
                ))}
              </CollectionPreviewDenseList>
            </CardHeader>
          </AccordionTrigger>

          <AccordionContent className="p-0">
            <CardContent className="px-1.5 pt-4 pb-2.5">
              <CollectionPreviewList className="">
                {[...collection.cards,...collection.cards].map((card) => (
                  <CollectionPreviewItem
                    imageUrl={card.imageUrl}
                    imageSize={56}
                    key={card.id}
                  />
                ))}
              </CollectionPreviewList>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export default CollectionWidgetCard
