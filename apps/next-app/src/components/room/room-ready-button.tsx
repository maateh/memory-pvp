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
  disabled,
  ...props
}: RoomReadyButtonProps) => {
  const ReadyIcon = isReady ? CircleX : CircleCheck

  return (
    <GlowingOverlay className="size-20 sm:size-24 mx-auto"
      overlayProps={{ className: cn("dark:opacity-15", { "opacity-80 dark:opacity-25": isReady }) }}
    >
      <Button className={cn("z-10 relative size-full flex-col justify-end gap-y-2 rounded-full text-accent-foreground bg-accent/90 shadow-accent/40 dark:shadow-accent/15 shadow-2xl drop-shadow-2xl hover:bg-accent/95 hover:shadow-accent/50 dark:hover:shadow-accent/20", {
        "bg-secondary/90 hover:bg-secondary/95": isReady
      }, className)}
        variant="ghost"
        size="icon"
        onClick={handleReady}
        disabled={connectionStatus !== "online" || roomStatus !== "joined" || disabled}
        {...props}
      >
        <ReadyIcon className="size-5 sm:size-6 shrink-0"
          strokeWidth={2.25}
        />

        <span className="text-sm sm:text-base font-heading">
          {isReady ? "Cancel" : "Ready"}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default RoomReadyButton
