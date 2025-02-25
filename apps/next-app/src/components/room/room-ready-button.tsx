"use client"

// types
import type { RoomConnectionStatus, RoomStatus } from "@repo/schema/room"

// utils
import { cn } from "@/lib/util"

// icons
import { CircleCheck, CircleX } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { GlowingOverlay } from "@/components/shared"

type RoomReadyButtonProps = {
  connectionStatus: RoomConnectionStatus
  roomStatus: RoomStatus
  isReady: boolean
  handleReady: () => void
} & Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "onClick">

const RoomReadyButton = ({
  connectionStatus,
  roomStatus,
  isReady,
  handleReady,
  className,
  ...props
}: RoomReadyButtonProps) => {
  const ReadyIcon = isReady ? CircleX : CircleCheck

  props.disabled = connectionStatus !== "online" ||
    (roomStatus !== "joined" && roomStatus !== "cancelled") ||
    props.disabled

  return (
    <GlowingOverlay className="size-20 sm:size-24 mx-auto"
      overlayProps={{
        className: cn("bg-accent opacity-85 dark:opacity-75", {
          "bg-secondary opacity-100 dark:opacity-90": isReady,
          "bg-muted-foreground opacity-35 dark:opacity-25": props.disabled
        })
      }}
    >
      <Button className={cn("z-10 relative size-full flex-col justify-center gap-y-1.5 rounded-full text-accent-foreground", {
        "bg-secondary/15 dark:bg-secondary/5": isReady
      }, className)}
        variant="ghost"
        size="icon"
        onClick={handleReady}
        {...props}
      >
        <ReadyIcon className="mt-2 size-5 sm:size-6 shrink-0" strokeWidth={2.25} />

        <span className="text-sm sm:text-base font-heading">
          {isReady ? "Cancel" : "Ready"}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default RoomReadyButton
