// utils
import { cn } from "@/lib/utils"

// shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionPreviewItem, CollectionPreviewList, CollectionQuickSetupLink } from "@/components/collection"

type CollectionExplorerCardProps = {
  collection: ClientCardCollection
  imageSize?: number
  showQuickSetup?: boolean
} & React.ComponentProps<typeof Card>

const CollectionExplorerCard = ({
  collection,
  imageSize = 40,
  showQuickSetup = false,
  className,
  ...props
}: CollectionExplorerCardProps) => {
  return (
    <Card className={cn("h-full max-w-xl mx-auto bg-primary/60", className)} {...props}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center gap-x-4">
          <div className="flex items-center gap-x-3">
            <Separator className="w-2 h-5 bg-accent rounded-full sm:h-6"
              orientation="vertical"
            />

            <CardTitle className="mt-1 text-xl sm:text-xl font-heading tracking-wide text-start break-all">
              {collection.name}
            </CardTitle>
          </div>

          {showQuickSetup && <CollectionQuickSetupLink collectionId={collection.id} />}
        </div>

        <CardDescription className="w-fit font-extralight text-sm text-start break-all">
          {collection.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CollectionPreviewList className="pt-2 justify-start group-data-[state=open]:hidden" dense>
          {collection.cards.map((card) => (
            <CollectionPreviewItem className="-ml-2 first:-ml-2"
              imageUrl={card.imageUrl}
              imageSize={imageSize}
              key={card.id}
              dense
            />
          ))}
        </CollectionPreviewList>
      </CardContent>
    </Card>
  )
}

export default CollectionExplorerCard
