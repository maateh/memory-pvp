import Image from "next/image"

// utils
import { cn } from "@/lib/utils"

// components
import { PlayerBadge } from "@/components/player"

type PlayerWithAvatarProps = {
  player: Pick<ClientPlayer, 'tag' | 'color' | 'isActive' | 'imageUrl'>
  playerBadgeProps?: Omit<React.ComponentProps<typeof PlayerBadge>, 'player'>
  imageSize?: number
  className?: string
}

const PlayerWithAvatar = ({ player, playerBadgeProps, imageSize = 24, className }: PlayerWithAvatarProps) => {
  const imageUrl = player.imageUrl || '/user-round.svg'

  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <Image className="border border-border/50 rounded-full img-wrapper"
        src={imageUrl}
        alt={`${player.tag}'s avatar`}
        width={imageSize}
        height={imageSize}
      />

      <PlayerBadge player={player} {...playerBadgeProps} />
    </div>
  )
}

export default PlayerWithAvatar
