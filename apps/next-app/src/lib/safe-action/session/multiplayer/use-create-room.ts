import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { createRoom } from "@/server/action/session/multiplayer-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useCreateRoomAction = () => {
  const router = useRouter()

  return useAction(createRoom, {
    onExecute() {
      toast.loading("Creating room...", { id: "room:create" })
    },
    onSettled() {
      toast.dismiss("room:create")
    },
    onSuccess() {
      toast.dismiss("room:create:error")

      toast.loading("Waiting room successfully created!", {
        description: "Connecting to the server...",
        id: "room:connect"
      })
    },
    onError({ error }) {
      if (error.serverError?.key === "ACTIVE_SESSION" || error.serverError?.key === "ACTIVE_ROOM") {
        const { message, description } = error.serverError

        toast.warning(message, {
          id: "room:create:error",
          description,
          duration: 10000,
          action: {
            label: "Reconnect",
            onClick() {
              router.push("/game/multiplayer")
            }
          }
        })
        return
      }

      handleServerError(error.serverError, "Failed to create waiting room. Please try again later.")
    }
  })
}
