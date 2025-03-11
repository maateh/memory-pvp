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
    onExecute() { toast.loading("Joining room...", { id: "room:join" }) },
    onSettled() { toast.dismiss("room:join") },
    onSuccess() {
      toast.dismiss("room:join:error")

      toast.loading("You have joined the room!", {
        description: "Connecting to the server...",
        id: "room:connect"
      })
    },
    onError({ error }) {
      if (
        error.serverError?.key === "ACTIVE_SESSION" ||
        error.serverError?.key === "ACTIVE_ROOM"
      ) {
        const { message, description } = error.serverError

        toast.warning(message, {
          id: "room:join:error",
          description,
          duration: 10000,
          action: {
            label: "Reconnect",
            onClick() { router.push("/game/multiplayer") }
          }
        })
        return
      }

      handleServerError(error.serverError, "Failed to join room. Please try again later.")
    }
  })
}
