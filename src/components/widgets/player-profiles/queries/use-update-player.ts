import { useRouter } from "next/navigation"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

type UpdatePlayerProps = {
  player: PlayerProfile
  updatedPlayer: Pick<PlayerProfile, 'tag' | 'color'>
  setEditing: (editing: boolean) => void
}

export const useUpdatePlayer = ({ player, updatedPlayer, setEditing }: UpdatePlayerProps) => {
  const router = useRouter()
  const utils = api.useUtils()

  const updatePlayer = api.playerProfile.update.useMutation({
    onSuccess: async () => {
      // TODO: add toast
      router.refresh()
      setEditing(false)

      await utils.user.getWithPlayerProfiles.invalidate()
    },
    onError: () => {
      // TODO: add toast
    }
  })

  const handleUpdatePlayer = async () => {
    const { tag, color } = updatedPlayer

    if (tag === player.tag && color === player.color) {
      setEditing(false)
    }

    try {
      await updatePlayer.mutateAsync({
        id: player.id,
        playerTag: tag,
        color
      })
    } catch (err) {
      throw new TRPCClientError('Failed to update player profile.', { cause: err as Error })
    }
  }

  return { updatePlayer, handleUpdatePlayer }
}
