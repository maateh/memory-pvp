import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { GameMode } from "@repo/db"

// actions
import { joinRoom } from "@/server/action/room-action"

// utils
import { handleServerError, logError } from "@/lib/util/error"

export const useJoinRoomAction = () => {
  const router = useRouter()

  return useAction(joinRoom, {
    onExecute() {
      toast.loading("Joining room...", { id: "room:join" })
    },
    onSuccess({ input: { forceJoin } }) {
      if (forceJoin) {
        toast.warning("Previous session has been abandoned.", {
          description: "Session is saved, but cannot be continued."
        })
      }

      toast.loading("You have joined the room!", {
        description: "Connecting to the server...",
        id: "room:connect"
      })
    },
    onError({ error, input }) {
      if (error.serverError?.key === "ACTIVE_SESSION") {
        const { message, description, data = null } = error.serverError
        const errorData = data as { activeSessionMode: GameMode } | null

        if (errorData?.activeSessionMode !== "SINGLE") {
          toast.warning(message, {
            description,
            duration: 10000,
            action: {
              label: "Reconnect",
              onClick() {
                router.push("/game/reconnect")
              }
            }
          })
          return
        }

        toast.warning(message, {
          description,
          duration: 10000,
          action: {
            label: "Force close & join",
            async onClick() {
              try {
                const { serverError } = await joinRoom({
                  ...input, forceJoin: true
                }) || {}

                if (serverError) {
                  handleServerError(serverError, "Failed to join room. Please try again later.")
                }
              } catch (err) {
                logError(err)
              }
            }
          }
        })
        return
      }

      if (error.serverError?.key === "ACTIVE_ROOM") {
        const { message, description } = error.serverError

        toast.warning(message, {
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
    },
    onSettled() {
      toast.dismiss("room:join")
    }
  })
}
