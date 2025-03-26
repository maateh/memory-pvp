"use client"

// types
import type { RunningRoom } from "@repo/schema/room"

// config
import { RECONNECTION_TIMEOUT } from "@repo/config/connection"

// helpers
import { otherPlayerKey } from "@repo/helper/player"

// utils
import { formatTimer } from "@/lib/util/game"
import { cn } from "@/lib/util"

// icons
import { MonitorX } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { GlowingOverlay } from "@/components/shared"

// hooks
import { useTimer } from "@/hooks/use-timer"
import { useRoomStore } from "@/components/provider/room-store-provider"

const SessionCloseButton = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "onClick" | "disabled">) => {
  const room = useRoomStore((state) => state.room) as RunningRoom
  const player = useRoomStore((state) => state.currentRoomPlayer)
  const sessionClose = useRoomStore((state) => state.sessionClose)

  const otherConnection = room[otherPlayerKey(room.owner.id, player.id)].connection
  const { timerInMs, stopped } = useTimer({
    timerType: "decrease",
    referenceDate: otherConnection.disconnectedAt || new Date(),
    stopAfterInMs: RECONNECTION_TIMEOUT
  })

  return (
    <GlowingOverlay className="h-20 w-28 sm:h-24 sm:w-32 mx-auto"
      overlayProps={{
        className: cn("bg-destructive opacity-85 dark:opacity-65 blur-md", {
          "bg-destructive/65": !stopped
        })
      }}
    >
      <Button className={cn("z-10 relative size-full px-6 flex-col rounded-full text-destructive-foreground transition-none disabled:opacity-60", className)}
        variant="ghost"
        size="icon"
        onClick={sessionClose}
        disabled={!stopped}
        {...props}
      >
        <MonitorX className="mt-2 size-5 sm:size-6 shrink-0" strokeWidth={2.25} />

        <span className="text-sm sm:text-base font-heading">
          {stopped ? "Close session" : formatTimer(timerInMs)}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default SessionCloseButton
