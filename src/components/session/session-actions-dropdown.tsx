"use client"

// prisma
import { GameStatus } from "@prisma/client"

// icons
import { DoorOpen, Gamepad, Menu } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// hooks
import { useFinishSessionMutation } from "@/lib/react-query/mutations/game"

type SessionActionsDropdownProps = {
  session: ClientGameSession
}

const SessionActionsDropdown = ({ session }: SessionActionsDropdownProps) => {
  const { finishSession, handleFinishSession } = useFinishSessionMutation()

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
          onClick={() => handleFinishSession('ABANDONED', session.status === GameStatus.OFFLINE)}
          disabled={finishSession.isPending}
        >
          <DoorOpen className="size-4" />
          <span>Abandon game</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SessionActionsDropdown
