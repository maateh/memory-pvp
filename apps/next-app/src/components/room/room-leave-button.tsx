"use client"

// utils
import { cn } from "@/lib/util"

// icons
import { DoorClosed } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { GlowingOverlay } from "@/components/shared"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"
import { useRoomStore } from "@/components/provider/room-store-provider"

const RoomLeaveButton = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "onClick" | "disabled">) => {
  const { socket } = useSocketService()

  const { status, owner } = useRoomStore((state) => state.room)
  const player = useRoomStore((state) => state.currentRoomPlayer)
  const roomCloseWaiting = useRoomStore((state) => state.roomCloseWaiting)
  const roomLeave = useRoomStore((state) => state.roomLeave)

  const disabled = !socket.active || player.ready || status === "ready"

  return (
    <GlowingOverlay className="h-14 mx-auto"
      overlayProps={{
        className: cn("bg-muted-foreground opacity-85 dark:opacity-65 blur-md", {
          "bg-muted-foreground opacity-40 dark:opacity-30": disabled
        })
      }}
    >
      <Button className={cn("z-10 relative size-full px-6 flex-col rounded-full text-muted transition-none", className)}
        variant="ghost"
        size="icon"
        onClick={player.id === owner.id ? roomCloseWaiting : roomLeave}
        disabled={disabled}
        {...props}
      >
        <DoorClosed className="size-4 sm:size-5 shrink-0 mt-2" strokeWidth={2.25} />

        <span className="text-sm font-heading">
          {player.id === owner.id ? "Close room" : "Leave room"}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default RoomLeaveButton
