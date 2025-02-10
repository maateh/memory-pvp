import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { joinRoom } from "@/server/action/room-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useJoinRoomAction = () => {
  const router = useRouter()

  return useAction(joinRoom, {
    onExecute() {
      toast.loading("Joining room...", { id: "room:join" })
    },
    onSuccess({ data }) {
      if (!data) return
      const { roomSlug } = data

      router.push(`/dashboard/rooms/${roomSlug}`)
      toast.loading("You have joined the room!", {
        description: "Connecting to the server...",
        id: "room:connect"
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, 'Failed to join room. Please try again later.')
    },
    onSettled() {
      toast.dismiss("room:join")
    }
  })
}
