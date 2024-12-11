// utils
import { cn } from "@/lib/util"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"

// components
import { PlayerProfileCard } from "@/components/player/listing"
import { CardItem, NoListingData } from "@/components/shared"

type PlayerProfileListingProps = {
  players: ClientPlayer[]
} & React.ComponentProps<"ul">

const PlayerProfileListing = ({ players, className, ...props }: PlayerProfileListingProps) => {
  if (players.length === 0) {
    return (
      <NoListingData
        iconProps={{ className: "sm:size-10 md:size-10" }}
        messageProps={{ className: "md:text-xl" }}
        message="No player found."
        hideClearFilter
      />
    )
  }

  return (
    <ul className={cn("space-y-3", className)} {...props}>
      {players.map((player) => (
        <CardItem className="rounded-2xl" key={player.tag}>
          <PlayerProfileCard key={player.tag} player={player} />
        </CardItem>
      ))}
    </ul>
  )
}

const PlayerProfileListingSkeleton = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul className={cn("space-y-3 px-2 sm:px-4", className)} {...props}>
      {Array.from({ length: 3 }).fill('').map((_, index) => (
        <CardItem className="p-0" key={index}>
          <Skeleton className="w-full h-28 bg-muted/75 rounded-xl" />
        </CardItem>
      ))}
    </ul>
  )
}

export default PlayerProfileListing
export { PlayerProfileListingSkeleton }
