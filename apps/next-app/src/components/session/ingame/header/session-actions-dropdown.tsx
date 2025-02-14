"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { toast } from "sonner"

// types
import type { ClientGameSession } from "@repo/schema/session"
import type { UseThemeProps } from "@/lib/types/theme"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/config/game-settings"

// utils
import { clearSessionFromStorage } from "@/lib/util/storage"
import { logError } from "@/lib/util/error"

// icons
import { Dices, DoorOpen, Gamepad2, Menu, Moon, Sun } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"

// hooks
import { useAbandonSessionAction } from "@/lib/safe-action/session"

type SessionActionsDropdownProps = {
  session: ClientGameSession
}

const SessionActionsDropdown = ({ session }: SessionActionsDropdownProps) => {
  const router = useRouter()
  const { theme, setTheme } = useTheme() as UseThemeProps

  const {
    executeAsync: executeAbandonSession,
    status: abandonSessionStatus
  } = useAbandonSessionAction()

  const handleAbandonSession = async () => {
    if (session.status === 'OFFLINE') {
      clearSessionFromStorage()
    
      router.replace('/game/setup')
      toast.info('Offline session has been abandoned.', {
        description: 'Abandoned offline sessions are not saved.'
      })
      return
    }

    try {
      await executeAbandonSession({ clientSession: session })
    } catch (err) {
      logError(err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-1 sm:p-1.5"
          variant="ghost"
          size="icon"
        >
          <Menu className="size-6" />
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
          variant="muted"
        >
          <Gamepad2 className="size-4" />

          <span className="text-foreground font-medium small-caps">
            {gameTypePlaceholders[session.type].label}
          </span> / <span className="text-foreground/85 small-caps">
            {gameModePlaceholders[session.mode].label}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-default sm:hidden"
          variant="muted"
        >
          <Dices className="size-4" />

          <span className="text-foreground font-medium capitalize small-caps">
            {tableSizePlaceholders[session.tableSize].label}
          </span>
          <span className="text-xs">
            / {tableSizePlaceholders[session.tableSize].size}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="sm:hidden" />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleAbandonSession}
          disabled={abandonSessionStatus === 'executing'}
        >
          <DoorOpen className="size-4" />
          <span>Abandon game</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SessionActionsDropdown
