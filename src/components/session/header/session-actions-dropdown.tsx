"use client"

import { useTheme } from "next-themes"

// icons
import { Dices, DoorOpen, Gamepad2, Menu, Moon, Sun } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// hooks
import { useAbandonSessionMutation } from "@/lib/react-query/mutations/game"
import { useOfflineSessionHandler } from "@/hooks/handler/session/use-offline-session-handler"
import { tableSizeMap } from "@/constants/game"

type SessionActionsDropdownProps = {
  session: ClientGameSession
}

const SessionActionsDropdown = ({ session }: SessionActionsDropdownProps) => {
  const { theme, setTheme } = useTheme() as UseThemeProps

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
        <Button className="p-1 sm:p-1.5"
          variant="ghost"
          size="icon"
        >
          <Menu className="size-5 sm:size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
      <DropdownMenuLabel className="flex items-center justify-between gap-x-8">
          <div className="flex items-center gap-x-2">
            <Separator className="h-4 w-1 rounded-full bg-border/50"
              orientation="vertical"
            />

            <p className="pt-0.5 text-base font-normal font-heading tracking-wider">
              Manage session
            </p>
          </div>

          <Gamepad2 className="size-4" strokeWidth={1.5} />
        </DropdownMenuLabel>

        <DropdownMenuItem className="w-fit py-1 ml-auto"
          variant="muted"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <span className="text-xs">
            Toggle theme
          </span>

          <Sun className="size-3.5 transition-all dark:hidden" />
          <Moon className="size-3.5 transition-all hidden dark:block" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-default sm:hidden"
          variant="secondary"
        >
          <Gamepad2 className="size-4" />
          <span className="capitalize">
            {session.type.toLowerCase()}
          </span> | <span className="capitalize">
            {session.mode.toLowerCase()}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-default sm:hidden"
          variant="accent"
        >
          <Dices className="size-4" />
          <span className="capitalize">
            {session.tableSize.toLowerCase()}
          </span>

          <span className="text-xs font-medium">
            ({tableSizeMap[session.tableSize]} cards)
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="sm:hidden" />

        <DropdownMenuItem
          variant="destructive"
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
