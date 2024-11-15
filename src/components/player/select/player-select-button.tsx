"use client"

import { forwardRef } from "react"

// clerk
import { useClerk } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/utils"

// icons
import { ChevronsUpDown } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { PlayerBadge } from "@/components/player"
import { PlayerSelectDrawer, PlayerSelectPopover } from "@/components/player/select"
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
            {...avatarProps}
          />
        )}

        {activePlayer ? (
          <PlayerBadge player={activePlayer} />
        ) : "Select player..."}
      </div>

      <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground/80" />
    </Button>
  )

  return isMobile ? (
    <PlayerSelectDrawer players={players} asChild>
      {button}
    </PlayerSelectDrawer>
  ) : (
    <PlayerSelectPopover players={players} asChild>
      {button}
    </PlayerSelectPopover>
  )
})
PlayerSelectButton.displayName = "PlayerSelectButton"

export default PlayerSelectButton
