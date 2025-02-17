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
    <GlowingOverlay className="h-[3.25rem] mx-auto"
      overlayProps={{ className: "inset-0 bg-muted-foreground opacity-40 dark:opacity-5 blur-md" }}
    >
      <Button className={cn("z-10 relative size-full px-4 flex-col rounded-full text-muted/85 bg-muted-foreground/70 shadow-muted-foreground/40 dark:shadow-muted-foreground/15 shadow-md hover:bg-muted-foreground/75 transition-none", className)}
        variant="ghost"
        size="icon"
        onClick={handleCloseOrLeave}
        disabled={isReady || roomStatus === "ready" || roomStatus === "starting" || disabled}
        {...props}
      >
        <DoorClosed className="size-4 sm:size-5 shrink-0"
          strokeWidth={2.25}
        />

        <span className="text-sm font-heading">
          {action === "leave" ? "Leave room" : "Close room"}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default RoomLeaveButton
