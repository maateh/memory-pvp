"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

// config
import {
  matchFormatPlaceholders,
  sessionModePlaceholders,
  tableSizePlaceholders
} from "@repo/config/game"

// utils
import { clearSessionFromStorage } from "@/lib/util/storage"
import { logError } from "@/lib/util/error"
import { cn } from "@/lib/util"

// icons
import { Dices, DoorOpen, Gamepad2, Info, Menu } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"
import { useForceCloseSoloSessionAction } from "@/lib/safe-action/session/singleplayer"
import { useRoomCloseEvent } from "@/hooks/event/use-room-close-event"

const SessionActionsDropdown = ({
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) => {
  const router = useRouter()
  const session = useSessionStore((state) => state.session)

  const {
    executeAsync: forceCloseSoloSession,
    status: forceCloseSoloSessionStatus
  } = useForceCloseSoloSessionAction()
  const { handleForceCloseRunningRoom } = useRoomCloseEvent()

  const handleCloseSession = async () => {
    if (session.format === "OFFLINE") {
      clearSessionFromStorage()
    
      router.replace("/game/setup")
      toast.info("Offline session closed.", {
        description: "Closed offline sessions are not saved."
      })
      return
    }

    try {
      if (session.format === "SOLO") {
        await forceCloseSoloSession(session)
        return
      }
      
      await handleForceCloseRunningRoom()
    } catch (err) {
      logError(err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("p-1 sm:p-1.5", className)}
          variant={variant}
          size={size}
          {...props}
        >
          <Menu className="size-6 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center gap-x-2">
          <Info className="size-4 shrink-0 text-muted-foreground" />
          <span className="mt-1 text-foreground/85 text-sm font-heading">
            Session info
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-default" variant="muted">
          <Gamepad2 className="size-4 shrink-0" />

          <span className="text-foreground font-medium small-caps">
            {sessionModePlaceholders[session.mode].label}
          </span> / <span className="text-foreground/85 small-caps">
            {matchFormatPlaceholders[session.format].label}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-default" variant="muted">
          <Dices className="size-4 shrink-0" />

          <span className="text-foreground font-medium capitalize small-caps">
            {tableSizePlaceholders[session.tableSize].label}
          </span>
          <span className="text-xs">
            / {tableSizePlaceholders[session.tableSize].size}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleCloseSession}
          disabled={forceCloseSoloSessionStatus === "executing"}
        >
          <DoorOpen className="size-4 shrink-0" />
          <span>Close session</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SessionActionsDropdown
