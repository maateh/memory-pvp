"use client"

import { forwardRef } from "react"

// types
import type { ClerkUser } from "@/lib/types/clerk"
import type { ClientPlayer } from "@repo/schema/player"

// clerk
import { useClerk } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/util"

// icons
import { ChevronsUpDown, Hash } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// components
import { PlayerBadge } from "@/components/player"
import { PlayerSelectCommand } from "@/components/player/select"
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
    <Popover>
      <PopoverTrigger asChild>
        {button}
      </PopoverTrigger>

      <PopoverContent className="px-2 pt-1.5 pb-1">
        <PlayerSelectCommand
          players={players}
          showPopupLink
        />
      </PopoverContent>
    </Popover>
  )
})
PlayerSelectButton.displayName = "PlayerSelectButton"

export default PlayerSelectButton
