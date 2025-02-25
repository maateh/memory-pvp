"use client"

// types
import type { RoomStatus } from "@repo/schema/room"

// utils
import { cn } from "@/lib/util"

// icons
import { DoorClosed, X } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { GlowingOverlay } from "@/components/shared"

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
  disabled,
  ...props
}: RoomLeaveButtonProps) => {  
  return (
    <GlowingOverlay className="h-14 mx-auto"
      overlayProps={{ className: "bg-muted-foreground opacity-85 dark:opacity-65 blur-md" }}
    >
      <Button className={cn("z-10 relative size-full px-6 flex-col rounded-full text-muted transition-none", className)}
        variant="ghost"
        size="icon"
        onClick={handleCloseOrLeave}
        disabled={isReady || roomStatus === "ready" || disabled}
        {...props}
      >
        <DoorClosed className="size-4 sm:size-5 shrink-0" strokeWidth={2.25} />

        <span className="text-sm font-heading">
          {action === "leave" ? "Leave room" : "Close room"}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default RoomLeaveButton
