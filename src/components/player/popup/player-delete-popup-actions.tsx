"use client"

import { useRouter } from "next/navigation"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useDeletePlayerMutation } from "@/lib/react-query/mutations/player"

type PlayerDeletePopupActionsProps = {
  player: ClientPlayer
}

const PlayerDeletePopupActions = ({ player }: PlayerDeletePopupActionsProps) => {
  const router = useRouter()

  const { deletePlayer, handleDeletePlayer } = useDeletePlayerMutation()

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
        onClick={() => handleDeletePlayer({ player, closeDialog: () => {} })}
        disabled={deletePlayer.isPending}
      >
        Delete
      </Button> 
    </>
  )
}

export default PlayerDeletePopupActions
