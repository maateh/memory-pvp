import { ZodError } from "zod"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

// prisma
import { PlayerProfile } from "@prisma/client"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

type UseUpdatePlayerProps = {
  setEditing: (editing: boolean) => void
}

type HandleUpdatePlayerProps = {
  player: PlayerProfile
  updatedPlayer: Pick<PlayerProfile, 'tag' | 'color'>
}

export const useUpdatePlayerMutation = ({ setEditing }: UseUpdatePlayerProps) => {
  const router = useRouter()
  const utils = api.useUtils()

  const updatePlayer = api.playerProfile.update.useMutation({
    onSuccess: async (player) => {
      toast.success('Player updated!', {
        description: `You've updated your player profile: ${player.tag}`
      })

      setEditing(false)
      router.refresh()
      await utils.playerProfile.invalidate()
    },
    onError: (err) => {
      if (err.data?.code === 'CONFLICT') {
        toast.error('Player tag is already in use.', {
          description: 'Please try another player tag.'
        })
        return
      }

      if (err instanceof ZodError) {
        toast.error('Validation error', {
          description: 'Please fill in fields correctly.'
        })
        return
      }

      toast.error('Something went wrong.', {
        description: 'Failed to update player profile. Please try again later.'
      })
    }
  })

  const handleUpdatePlayer = async ({ player, updatedPlayer }: HandleUpdatePlayerProps) => {
    const { tag, color } = updatedPlayer

    if (tag === player.tag && color === player.color) {
      setEditing(false)
      return
    }

    try {
      await updatePlayer.mutateAsync({
        playerId: player.id,
        playerTag: tag,
        color
      })
    } catch (err) {
      throw new TRPCClientError('Failed to update player profile.', { cause: err as Error })
    }
  }

  return { updatePlayer, handleUpdatePlayer }
}
