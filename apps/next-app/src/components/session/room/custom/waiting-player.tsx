// types
import type { ClientPlayer } from "@repo/schema/player"

// components
import { PlayerBadge } from "@/components/player"
import { UserAvatar } from "@/components/user"

type WaitingPlayerProps = {
  player: ClientPlayer
}

const WaitingPlayer = ({ player }: WaitingPlayerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-3">
      <UserAvatar className="size-12"
        user={{
          username: player.tag,
          imageUrl: player.imageUrl
        }}
        imageSize={256}
      />
      
      <PlayerBadge
        size="lg"
        player={player}
      />
    </div>
  )
}

export default WaitingPlayer
