"use client"

import { useRouter } from "next/navigation"

// shadcn
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// hooks
import { useGameStore, type UnsignedClientGameSession } from "@/hooks/use-game-store"

type SessionRunningWarningModalProps = {
  session: UnsignedClientGameSession | null
  isOffline: boolean
}

const SessionRunningWarningModal = ({ session, isOffline }: SessionRunningWarningModalProps) => {
  const router = useRouter()

  if (isOffline) {
    session = useGameStore.getState().session
  }

  const handleStartNew = () => {
    // TODO: implement
  }

  const handleContinue = () => {
    const route = isOffline ? '/game/offline' : '/game'
    router.replace(route)
  }

  return (
    <Dialog open onOpenChange={() => router.replace('/game/setup')}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl sm:text-2xl font-heading font-normal underline decoration-destructive underline-offset-8">
            <span className="text-destructive font-semibold">Active</span> session found
          </DialogTitle>

          <DialogDescription className="w-5/6 mx-auto">
            We found a previous session that you haven&apos;t finished yet. Do you want to finish it now or start a new session?
          </DialogDescription>
        </DialogHeader>

        <Separator className="w-3/5 mx-auto mt-1 mb-2.5 bg-border/25" />

        <div>
          TODO: show session info
        </div>

        <DialogFooter className="mt-2.5 mx-8 flex flex-wrap flex-row items-center justify-around gap-x-8 gap-y-2.5 sm:justify-around">
          <Button className="flex-1 max-w-64 border"
            variant="ghost"
            onClick={handleStartNew}
          >
            Start new game
          </Button>
          <Button className="flex-1 max-w-64"
            variant="secondary"
            onClick={handleContinue}
          >
            Continue previous
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SessionRunningWarningModal
