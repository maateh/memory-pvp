import Image from "next/image"

// prisma
import { PlayerProfile } from "@prisma/client"

// utils
import { cn } from "@/lib/utils"

// icons
import { LucideProps, UserRound } from "lucide-react"

// components
import { PlayerBadge, PlayerBadgeProps } from "@/components/player"

type PlayerWithAvatarProps = {
  player: Pick<PlayerProfile, 'tag' | 'color'>
  imageUrl?: string | null
  imageSize?: number
  playerBadgeProps?: Omit<PlayerBadgeProps, 'player'>
  imgFallbackProps?: LucideProps
  className?: string
}

const PlayerWithAvatar = ({ player, imageUrl, playerBadgeProps, imageSize = 24, imgFallbackProps, className }: PlayerWithAvatarProps) => {
  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      {imageUrl ? (
        <Image className="border border-border/50 rounded-full img-wrapper"
          src={imageUrl}
          alt={`${player.tag}'s avatar`}
          width={imageSize}
          height={imageSize}
        />
      ) : (
        <UserRound {...imgFallbackProps}
          className={cn("size-5 rounded-full", imgFallbackProps?.className)}
        />
      )}

      <PlayerBadge {...playerBadgeProps} className={cn("w-fit", playerBadgeProps?.className)}
        player={{
          tag: player.tag,
          color: player.color,
          isActive: false
        }}
      />
    </div>
  )
}

export default PlayerWithAvatar
