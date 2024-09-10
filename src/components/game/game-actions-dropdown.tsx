"use client"

// icons
import { DoorOpen, Gamepad, Menu } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// hooks
import { useFinishSessionMutation } from "@/lib/react-query/mutations/game"

const GameActionsDropdown = () => {
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
          // TODO: get session
          // onClick={() => handleFinishSession('ABANDONED', { offline: session.status === 'offline' })}
          onClick={() => handleFinishSession('ABANDONED')}
          disabled={finishSession.isPending}
        >
          <DoorOpen className="size-4" />
          <span>Exit game</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GameActionsDropdown
