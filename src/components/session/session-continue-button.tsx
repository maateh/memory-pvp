"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

// utils
import { cn } from "@/lib/utils"

// icons
import { StepForward } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useSessionStore } from "@/hooks/store/use-session-store"

type SessionContinueButtonProps = {
  session: ClientGameSession
} & Omit<React.ComponentProps<typeof Button>, 'onClick' | 'tooltip'>

const SessionContinueButton = ({
  session,
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: SessionContinueButtonProps) => {
  const router = useRouter()
  const registerSession = useSessionStore((state) => state.register)

  const continueSession = () => {
    registerSession({
      ...session,
      continuedAt: new Date()
    })
    
    router.push('/game/single')
    toast.info('Game session continued!', {
      description: `${session.type} | ${session.mode} | ${session.tableSize}`
    })
  }

  return (
    <Button className={cn("ml-auto p-2.5 rounded-full", className)}
      tooltip="Continue session"
      variant={variant}
      size={size}
      onClick={continueSession}
      {...props}
    >
      <StepForward className="size-4 sm:size-5 shrink-0 text-accent"
        strokeWidth={2.5}
      />
    </Button>
  )
}

export default SessionContinueButton
