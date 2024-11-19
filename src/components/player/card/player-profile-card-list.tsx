// types
import type { PlayerFilter, PlayerSort } from "@/components/player/filter/types"

// server
import { getPlayers } from "@/server/db/player"

// utils
import { cn } from "@/lib/utils"

// components
import { CardItem, Warning } from "@/components/shared"
import PlayerProfileCard from "./player-profile-card"

type PlayerProfileCardListProps = {
  filter: PlayerFilter
  sort: PlayerSort
} & React.ComponentProps<"ul">

const PlayerProfileCardList = async ({ filter, sort, className, ...props }: PlayerProfileCardListProps) => {
  const players = await getPlayers({ filter, sort })

  if (players.length === 0) {
    const message = filter
      ? "Couldn't find player with the specified filter."
      : "You don't have any player profiles created."

    return (
      <CardItem className="py-3.5 justify-center">
        <Warning message={message} />
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

export default PlayerProfileCardList
