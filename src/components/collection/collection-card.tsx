import Link from "next/link"

// utils
import { cn } from "@/lib/utils"

// icons
import { ImagePlay } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// components
import {
  CollectionPreviewDenseItem,
  CollectionPreviewDenseList
} from "@/components/collection/collection-preview-listing"

type CollectionCardProps = {
  collection: ClientCardCollection
  imageSize?: number
  withoutGameLink?: boolean
} & React.ComponentProps<typeof Card>

const CollectionCard = ({
  collection,
  imageSize = 40,
  withoutGameLink = false,
  className,
  ...props
}: CollectionCardProps) => {
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

          {/* TODO: handle this on the setup form */}
          {!withoutGameLink && (
            <Link className={cn(buttonVariants({
              className: "expandable text-muted-foreground bg-muted hover:bg-muted/90 dark:hover:bg-muted/90 hover:text-foreground/70",
              variant: "ghost",
              size: "icon"
            }))}
              href={`/game/setup?collection=${collection.id}`}
            >
              <ImagePlay className="size-4 sm:size-5" />
            </Link>
          )}
        </div>

        <CardDescription className="w-fit font-extralight text-sm text-start break-all">
          {collection.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CollectionPreviewDenseList className="pt-2 justify-start group-data-[state=open]:hidden">
          {collection.cards.map((card) => (
            <CollectionPreviewDenseItem className="-ml-2 first:-ml-2"
              imageUrl={card.imageUrl}
              imageSize={imageSize}
              key={card.id}
            />
          ))}
        </CollectionPreviewDenseList>
      </CardContent>
    </Card>
  )
}

export default CollectionCard
