// utils
import { cn } from "@/lib/utils"

// shadcn
import { Skeleton } from "@/components/ui/skeleton"

// components
import { CardItem, Warning } from "@/components/shared"
import PlayerProfileCard from "./player-profile-card"

type PlayerProfileCardListProps = {
  players: ClientPlayer[]
} & React.ComponentProps<"ul">

const PlayerProfileCardList = ({ players, className, ...props }: PlayerProfileCardListProps) => {
  if (players.length === 0) {
    return (
      <CardItem className="py-3.5 justify-center">
        <Warning message="No players found." />
      </CardItem>
    )
  }

  return (
    <ul className={cn("space-y-2", className)} {...props}>
      {players.map((player) => (
        <CardItem key={player.tag}>
          <PlayerProfileCard key={player.tag} player={player} />
        </CardItem>
      ))}
    </ul>
  )
}

const PlayerProfileCardListSkeleton = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul className={cn("space-y-3 px-2 sm:px-4", className)} {...props}>
      {Array(3).fill('').map((_, index) => (
        <CardItem className="p-0" key={index}>
          <Skeleton className="w-full h-28 bg-muted/75 rounded-xl" />
        </CardItem>
      ))}
    </ul>
  )
}

export default PlayerProfileCardList
export { PlayerProfileCardListSkeleton }
