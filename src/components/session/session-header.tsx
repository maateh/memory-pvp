"use client"

// utils
import { formatTimer } from "@/lib/utils/game"

// components
import { ThemeToggle } from "@/components/shared"
import { SessionActionsDropdown } from "@/components/session"

// hooks
import { useTimer } from "@/hooks/use-timer"

type SessionHeaderProps = {
  session: ClientGameSession
}

const SessionHeader = ({ session }: SessionHeaderProps) => {
  const { timer } = useTimer({ initialInMs: session.timer * 1000 })

  return (
    <div className="w-full min-h-14 mx-auto py-3 px-1.5 flex items-center justify-between bg-primary sm:px-5 sm:rounded-b-2xl sm:max-w-lg md:max-w-xl">
      <SessionActionsDropdown session={session} />

      <p className="text-lg">{formatTimer(timer)}</p>

      <ThemeToggle className="hover:bg-primary-foreground/5 hover:text-primary-foreground"
        variant="ghost"
      />
    </div>
  )
}

export default SessionHeader
