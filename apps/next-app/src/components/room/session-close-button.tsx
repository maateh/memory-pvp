"use client"

import { useMemo } from "react"

// types
import type { PlayerConnection } from "@repo/schema/player-connection"

// helpers
import { reconnectionTimeExpired } from "@repo/helper/connection"

// utils
import { cn } from "@/lib/util"

// icons
import { MonitorX } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { GlowingOverlay } from "@/components/shared"

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
  // TODO: timer
  const reconnectionExpired = useMemo<boolean>(() => {
    return reconnectionTimeExpired(otherConnection)
  }, [otherConnection])

  props.disabled = reconnectionExpired || props.disabled

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
          Close session
        </span>
      </Button>
    </GlowingOverlay>
  )
}

export default SessionCloseButton
