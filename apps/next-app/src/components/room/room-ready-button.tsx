"use client"

// utils
import { cn } from "@/lib/util"

// icons
import { CircleCheck, CircleX } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { GlowingOverlay } from "@/components/shared"

// hooks
import { useRoomStore } from "@/components/provider/room-store-provider"

const RoomReadyButton = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "onClick" | "disabled">) => {
  const { connectionStatus, status } = useRoomStore((state) => state.room)
  const player = useRoomStore((state) => state.currentRoomPlayer)
  const roomReady = useRoomStore((state) => state.roomReady)

  const ReadyIcon = player.ready ? CircleX : CircleCheck
  const disabled = connectionStatus !== "online"
    || (status !== "joined" && status !== "cancelled")

  return (
    <GlowingOverlay className="size-20 sm:size-24 mx-auto"
      overlayProps={{
        className: cn("bg-accent opacity-85 dark:opacity-75", {
          "bg-secondary opacity-100 dark:opacity-90": player.ready,
          "bg-muted-foreground opacity-35 dark:opacity-25": disabled
        })
      }}
    >
      <Button className={cn("z-10 relative size-full flex-col justify-center gap-y-1.5 rounded-full text-accent-foreground", {
        "bg-secondary/15 dark:bg-secondary/5": player.ready
      }, className)}
        variant="ghost"
        size="icon"
        onClick={roomReady}
        disabled={disabled}
        {...props}
      >
        <ReadyIcon className="mt-2 size-5 sm:size-6 shrink-0" strokeWidth={2.25} />

        <span className="text-sm sm:text-base font-heading">
          {player.ready ? "Cancel" : "Ready"}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default RoomReadyButton
