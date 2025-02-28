"use client"

// types
import type { PlayerConnection } from "@repo/schema/player-connection"

// config
import { RECONNECTION_TIMEOUT } from "@repo/config/connection"

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

type SessionCloseButtonProps = {
  otherConnection: PlayerConnection
  handleSessionClose: () => void
} & Omit<React.ComponentProps<typeof Button>, "tooltip" | "variant" | "size" | "onClick">

const SessionCloseButton = ({
  otherConnection,
  handleSessionClose,
  className,
  ...props
}: SessionCloseButtonProps) => {
  const { timerInMs, stopped } = useTimer({
    timerType: "decrease",
    referenceDate: otherConnection.disconnectedAt || new Date(),
    stopAfterInMs: RECONNECTION_TIMEOUT
  })

  props.disabled = !stopped || props.disabled

  return (
    <GlowingOverlay className="h-20 w-28 sm:h-24 sm:w-32 mx-auto"
      overlayProps={{
        className: cn("bg-destructive opacity-85 dark:opacity-65 blur-md", {
          "bg-destructive/65": props.disabled
        })
      }}
    >
      <Button className={cn("z-10 relative size-full px-6 flex-col rounded-full text-destructive-foreground transition-none disabled:opacity-60", className)}
        variant="ghost"
        size="icon"
        onClick={handleSessionClose}
        {...props}
      >
        <MonitorX className="mt-2 size-5 sm:size-6 shrink-0" strokeWidth={2.25} />

        <span className="text-sm sm:text-base font-heading">
          {props.disabled ? formatTimer(timerInMs) : "Close session"}
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default SessionCloseButton
