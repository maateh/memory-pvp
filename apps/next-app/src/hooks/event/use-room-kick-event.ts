import { toast } from "sonner"

// types
import type { WaitingRoom } from "@repo/schema/room"
import type { SocketResponse } from "@repo/server/socket-types"

// server
import { ServerError } from "@repo/server/error"

// utils
import { handleServerError, logError } from "@/lib/util/error"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"
import { useRoomStore } from "@/components/provider/room-store-provider"

type UseRoomKickEventReturn = {
  handleKickPlayer: () => Promise<void>
}

/**
 * Provides an event handler for kicking a player from a waiting room.
 *
 * This hook manages the process of removing a player from the room using a 
 * socket event. It updates the room state and displays relevant UI messages.
 *
 * @returns {UseRoomKickEventReturn} An object containing:
 * - `handleKickPlayer`: Sends a request to kick a player, updates the room state,
 *   and provides user feedback via toast notifications.
 */
export function useRoomKickEvent(): UseRoomKickEventReturn {
  const { socket } = useSocketService()
  const setRoomState = useRoomStore((state) => state.setState)

  return {
    async handleKickPlayer() {
      toast.loading("Kicking player...", { id: "room:kick" })

      try {
        const {
          data: room,
          message,
          description,
          error
        }: SocketResponse<WaitingRoom> = await socket.emitWithAck("room:kick", {})
    
        if (error || !room) {
          throw ServerError.parser(error)
        }
    
        toast.success(message, { description, id: "room:kick:response" })
        setRoomState(({ currentRoomPlayer }) => {
          currentRoomPlayer.ready = false
          return { currentRoomPlayer, room }
        })
      } catch (err) {
        handleServerError(err as ServerError)
        logError(err)
      } finally { toast.dismiss("room:kick") }
    }
  }
}
