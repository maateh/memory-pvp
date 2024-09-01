import { useRouter } from "next/navigation"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

type SelectAsActiveProps = {
  playerId: string
}

export const useSelectAsActive = ({ playerId }: SelectAsActiveProps) => {
  const router = useRouter()
  const utils = api.useUtils()

  const selectAsActive = api.playerProfile.selectAsActive.useMutation({
    onSuccess: async () => {
      // TODO: add toast
      router.refresh()

      await utils.user.getWithPlayerProfiles.invalidate()
    },
    onError: () => {
      // TODO: add toast
    }
  })

  const handleSelectAsActive = async () => {
    try {
      await selectAsActive.mutateAsync({ playerId })
    } catch (err) {
      throw new TRPCClientError('Failed to update player profile.', { cause: err as Error })
    }
  }

  return { selectAsActive, handleSelectAsActive }
}
