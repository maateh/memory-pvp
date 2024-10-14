// prisma
import { PlayerProfile } from "@prisma/client"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"

// components
import { CardItem, Warning } from "@/components/shared"
import PlayerProfileCard from "./player-profile-card"

type PlayerProfileCardListProps = {
  players: PlayerProfile[] | undefined
}

const PlayerProfileCardList = ({ players }: PlayerProfileCardListProps) => {
  if (!players || !players.length) {
    return (
      <Warning message="Currently, you don't have any player profiles." />
    )
  }

  return (
    <ScrollArea className="max-h-60 pr-3">
      <ul className="space-y-2">
        {players.map((player) => (
          <CardItem key={player.id}>
            <PlayerProfileCard player={player} />
          </CardItem>
        ))}
      </ul>
    </ScrollArea>
  )
}

export default PlayerProfileCardList
