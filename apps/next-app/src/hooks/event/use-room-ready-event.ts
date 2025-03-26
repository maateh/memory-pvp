import { toast } from "sonner"

// types
import { SocketResponse } from "@repo/server/socket-types"

// server
import { ServerError } from "@repo/server/error"

// utils
import { handleServerError, logError } from "@/lib/util/error"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"
import { useRoomStore } from "@/components/provider/room-store-provider"

type UseRoomReadyEventReturn = {
  toggleReady: () => Promise<void>
}

/**
 * Provides an event handler for toggling a player's ready status in a room.
 *
 * This hook sends a request to update the player's ready state, updates the 
 * UI accordingly, and displays relevant feedback messages.
 *
 * @returns {UseRoomReadyEventReturn} An object containing:
 * - `toggleReady`: Toggles the player's ready status, updates the room state, 
 *   and shows success or informational toasts based on the new state.
 */
export function useRoomReadyEvent(): UseRoomReadyEventReturn {
  const { socket } = useSocketService()
  const setRoomState = useRoomStore((state) => state.setState)

  return {
    async toggleReady() {
      toast.loading("Updating your status...", { id: "room:ready" })

      try {
        const {
          data: ready,
          message,
          description,
          error
        }: SocketResponse<boolean> = await socket.emitWithAck("room:ready", {})
  
        if (error || typeof ready !== "boolean") {
          throw ServerError.parser(error)
        }
  
        setRoomState(({ currentRoomPlayer }) => {
          currentRoomPlayer.ready = ready
          return { currentRoomPlayer }
        })
  
        const toaster = ready ? toast.success : toast.info
        toaster(message, { id: "room:ready:response", description })
      } catch (err) {
        handleServerError(err as ServerError)
        logError(err)
      } finally { toast.dismiss("room:ready") }
    }
  }
}
