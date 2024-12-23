import { formatDistance } from "date-fns"

// types
import type { CollectionListingMetadata } from "./collection-listing"

// config
import { tableSizePlaceholders } from "@/config/game-settings"

// utils
import { cn } from "@/lib/util"

// icons
import { CalendarCheck, Dices } from "lucide-react"

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
import {
  CollectionPreviewItem,
  CollectionPreviewList
} from "@/components/collection/collection-preview-listing"
import { SessionInfoBadge } from "@/components/session"
import { UserAvatar } from "@/components/user"
import CollectionActions from "./collection-actions"

type CollectionCardProps = {
  collection: ClientCardCollection
  metadata: CollectionListingMetadata
  imageSize?: number
  showActions?: boolean
} & React.ComponentProps<typeof Card>

const CollectionCard = ({
  collection,
  metadata,
  imageSize,
  showActions = false,
  className,
  ...props
}: CollectionCardProps) => {
  return (
    <Card className={cn("h-full max-w-xl mx-auto bg-primary/95", className)} {...props}>
      <CardHeader className="pb-0 flex-row justify-between items-center gap-x-4">
        <div className="space-y-1">
          <div className="flex items-center gap-x-3">
            <Separator className="w-2 h-5 bg-accent rounded-full sm:h-6"
              orientation="vertical"
            />

            <CardTitle className="mt-1 text-lg sm:text-xl font-heading tracking-wide text-start line-clamp-1">
              {collection.name}
            </CardTitle>
          </div>

          <SessionInfoBadge className="px-2 py-0 text-xs"
            iconProps={{ className: "size-3.5" }}
            Icon={Dices}
            label={tableSizePlaceholders[collection.tableSize].label}
            subLabel={tableSizePlaceholders[collection.tableSize].size}
          />

          <CardDescription className="w-fit font-extralight text-sm text-start line-clamp-2">
            {collection.description}
          </CardDescription>
        </div>

        {showActions && (
          <CollectionActions
            collection={collection}
            metadata={metadata}
          />
        )}
      </CardHeader>

      <CardContent>
        <CollectionPreviewList className="pt-3 justify-start" dense>
          {collection.cards.map((card) => (
            <CollectionPreviewItem className="-ml-2 first:-ml-2"
              imageUrl={card.imageUrl}
              imageSize={imageSize}
              key={card.id}
              dense
            />
          ))}
        </CollectionPreviewList>

        <Separator className="my-2.5 bg-border/20" />

        <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-4">
          <div className="flex items-center gap-x-1.5">
            <CalendarCheck className="size-3.5 shrink-0 text-foreground/80" />
            <p className="text-muted-foreground text-xs font-light">
              Uploaded <span className="text-foreground/80 font-normal tracking-wide">
                {formatDistance(collection.createdAt, Date.now(), { addSuffix: true })}
              </span>
            </p>
          </div>

          <div className="ml-auto flex items-center gap-x-2">
            <p className="text-muted-foreground text-xs">
              Uploaded by <span className="text-foreground/80 font-medium tracking-wide">
                {collection.user.username}
              </span>
            </p>

            <UserAvatar className="size-5"
              user={collection.user}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CollectionCard
