import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { api } from "@/trpc/client"

// utils
import { handleApiError } from "@/lib/utils"

type UseUpdatePlayerProps = {
  setEditing: (editing: boolean) => void
}

type HandleUpdatePlayerProps = {
  player: PlayerProfile
  updatedPlayer: Pick<PlayerProfile, 'tag' | 'color'>
}

export const useUpdatePlayerMutation = ({ setEditing }: UseUpdatePlayerProps) => {
  const router = useRouter()

  const updatePlayer = api.playerProfile.update.useMutation({
    onSuccess: async ({ tag }) => {
      toast.success('Player updated!', {
        description: `You've updated this player profile: ${tag}`
      })

      setEditing(false)
      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to update player profile. Please try again later.')
    }
  })

  const handleUpdatePlayer = async ({ player, updatedPlayer }: HandleUpdatePlayerProps) => {
    const { tag, color } = updatedPlayer

    if (tag === player.tag && color === player.color) {
      setEditing(false)
      return
    }

    await updatePlayer.mutateAsync({
      playerId: player.id,
      playerTag: tag,
      color
    })
  }

  return { updatePlayer, handleUpdatePlayer }
}
