"use client"

// icons
import { DoorOpen, Gamepad, Menu } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// hooks
import { useAbandonSessionMutation } from "@/lib/react-query/mutations/game"
import { useOfflineSessionHandler } from "@/hooks/handler/session/use-offline-session-handler"

type SessionActionsDropdownProps = {
  session: ClientGameSession
}

const SessionActionsDropdown = ({ session }: SessionActionsDropdownProps) => {
  const { abandonSession, handleAbandonSession } = useAbandonSessionMutation()
  const { abandonOfflineSession } = useOfflineSessionHandler()

  const handleAbandon = () => {
    if (session.status === 'OFFLINE') {
      abandonOfflineSession()
      return
    }

    handleAbandonSession(session)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="hover:bg-primary-foreground/5 hover:text-primary-foreground"
          variant="ghost"
          size="icon"
        >
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center gap-x-2">
          <Gamepad className="size-5" />
          <span>Game actions</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive"
          onClick={handleAbandon}
          disabled={abandonSession.isPending}
        >
          <DoorOpen className="size-4" />
          <span>Abandon game</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SessionActionsDropdown
