"use client"

// types
import type { RoomStatus } from "@repo/schema/room"

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

type RoomLeaveButtonProps = {
  action: "leave" | "close"
  roomStatus: RoomStatus
  isReady: boolean
  handleCloseOrLeave: () => void
} & Omit<React.ComponentProps<typeof Button>, "tooltip" | "onClick">

const RoomLeaveButton = ({
  action,
  roomStatus,
  isReady,
  handleCloseOrLeave,
  variant = "destructive",
  size = "lg",
  className,
  ...props
}: RoomLeaveButtonProps) => {
  const { socket } = useSocketService()

  props.disabled = !socket.active || isReady || roomStatus === "ready" || props.disabled

  return (
    <GlowingOverlay className="h-14 mx-auto"
      overlayProps={{
        className: cn("bg-muted-foreground opacity-85 dark:opacity-65 blur-md", {
          "bg-muted-foreground opacity-40 dark:opacity-30": props.disabled
        })
      }}
    >
      <Button className={cn("z-10 relative size-full px-6 flex-col rounded-full text-muted transition-none", className)}
        variant="ghost"
        size="icon"
        onClick={handleCloseOrLeave}
        {...props}
      >
        <DoorClosed className="size-4 sm:size-5 shrink-0 mt-2" strokeWidth={2.25} />

        <span className="text-sm font-heading">
          {action === "leave" ? "Leave room" : "Close room"}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default RoomLeaveButton
