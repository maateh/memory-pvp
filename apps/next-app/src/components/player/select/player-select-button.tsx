"use client"

import { forwardRef } from "react"

// types
import type { ClerkUser } from "@/lib/schema/user-schema"
import type { ClientPlayer } from "@/lib/schema/player-schema"

// clerk
import { useClerk } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/util"

// icons
import { ChevronsUpDown, Hash } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { PlayerBadge } from "@/components/player"
import { PlayerSelectPopover } from "@/components/player/select"
import { PlayerSelectPopup } from "@/components/player/popup"
import { UserAvatar } from "@/components/user"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

type PlayerSelectButtonProps = {
  players: ClientPlayer[]
  showUserAvatar?: boolean
  avatarProps?: Omit<React.ComponentProps<typeof UserAvatar>, 'user'>
} & React.ComponentProps<typeof Button>

const PlayerSelectButton = forwardRef<HTMLButtonElement, PlayerSelectButtonProps>(({
  players,
  showUserAvatar = false,
  avatarProps,
  className,
  variant = "ghost",
  size = "lg",
  ...props
}, ref) => {
  const { user } = useClerk()
  const isMobile = useIsMobile()

  const activePlayer = players.find((player) => player.isActive)

  const button = (
    <Button className={cn("justify-between hover:bg-primary/15 dark:hover:bg-primary/10", className)}
      variant={variant}
      size={size}
      ref={ref}
      {...props}
    >
      <div className="flex justify-center items-center gap-x-2">
        {showUserAvatar && (
          <UserAvatar
            user={user as ClerkUser}
            showTooltip
            {...avatarProps}
          />
        )}

        {activePlayer ? (
          <PlayerBadge player={activePlayer} />
        ) : (
          <div className="flex items-center gap-x-2">
            <Hash className="size-3.5 shrink-0 text-muted-foreground group-hover:opacity-95"
              strokeWidth={2.5}
            />

            <span className="text-xs text-foreground/85 font-normal">
              Select player...
            </span>
          </div>
        )}
      </div>

      <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground/80" />
    </Button>
  )

  return isMobile ? (
    <PlayerSelectPopup
      renderer="trigger"
      players={players}
      asChild
    >
      {button}
    </PlayerSelectPopup>
  ) : (
    <PlayerSelectPopover players={players} asChild>
      {button}
    </PlayerSelectPopover>
  )
})
PlayerSelectButton.displayName = "PlayerSelectButton"

export default PlayerSelectButton
