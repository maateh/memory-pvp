"use client"

import { useRouter } from "next/navigation"

// types
import type { ClientPlayer } from "@repo/schema/player"

// shadcn
import { Button } from "@/components/ui/button"
import { useDeletePlayerAction } from "@/lib/safe-action/player"

type PlayerDeletePopupActionsProps = {
  player: ClientPlayer
}

const PlayerDeletePopupActions = ({ player }: PlayerDeletePopupActionsProps) => {
  const router = useRouter()

  const { execute: executeDeletePlayer, status: deletePlayerStatus } = useDeletePlayerAction()

  return (
    <>
      <Button className="min-w-32"
        variant="outline"
        onClick={router.back}
      >
        Cancel
      </Button>

      <Button className="min-w-32"
        variant="destructive"
        onClick={() => executeDeletePlayer(player.tag)}
        disabled={deletePlayerStatus === 'executing'}
      >
        Delete
      </Button> 
    </>
  )
}

export default PlayerDeletePopupActions
