import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { createRoom } from "@/server/action/room-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useCreateRoomAction = () => {
  const router = useRouter()

  return useAction(createRoom, {
    onExecute() {
      toast.loading("Creating room...", { id: "room:create" })
    },
    onSuccess({ data }) {
      if (!data) return
      const { roomSlug } = data

      router.push(`/game/room/${roomSlug}`)
      toast.loading("Waiting room successfully created!", {
        description: "Connecting to the server...",
        id: "room:connect"
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, 'Failed to create waiting room. Please try again later.')
    },
    onSettled() {
      toast.dismiss("room:create")
    }
  })
}
