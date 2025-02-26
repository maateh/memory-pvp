"use client"

// utils
import { cn } from "@/lib/util"

// icons
import { MonitorX } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { GlowingOverlay } from "@/components/shared"

type SessionCloseButtonProps = {
  handleSessionClose: () => void
} & Omit<React.ComponentProps<typeof Button>, "tooltip" | "variant" | "size" | "onClick">

const SessionCloseButton = ({
  handleSessionClose,
  className,
  ...props
}: SessionCloseButtonProps) => {
  // TODO:
  // - create proper design
  // - if `session.type === "COMPETITIVE"`
  //   -> enable button only if the connected user is able to close the session
  //   -> otherwise show timer until session can be closed

  return (
    <GlowingOverlay className="size-20 sm:size-24 mx-auto"
      overlayProps={{ className: "bg-destructive opacity-85 dark:opacity-65 blur-md" }}
    >
      <Button className={cn("z-10 relative size-full px-6 flex-col rounded-full text-muted transition-none", className)}
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
