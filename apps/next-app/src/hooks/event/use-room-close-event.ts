import { use } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { SocketResponse } from "@repo/server/socket-types"

// server
import { ServerError } from "@repo/server/error"

// utils
import { handleServerError, logError } from "@/lib/util/error"

// context
import { RoomStoreContext } from "@/components/provider/room-store-provider"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

type UseRoomCloseEventReturn = {
  handleCloseWaitingRoom: () => Promise<void>
  handleCloseCancelledRoom: () => Promise<void>
  handleForceCloseRunningRoom: () => Promise<void>
}

/**
 * Provides event handlers for closing different types of game rooms.
 *
 * This hook manages the process of closing rooms, including waiting rooms, 
 * cancelled rooms, and force-closing running rooms. It interacts with the 
 * socket service and updates the UI accordingly.
 *
 * @returns {UseRoomCloseEventReturn} An object containing functions to handle room closing events:
 * - `handleCloseWaitingRoom`: Closes a waiting room and redirects to the setup page.
 * - `handleCloseCancelledRoom`: Closes a cancelled room and redirects to the game summary.
 * - `handleForceCloseRunningRoom`: Force-closes a running session.
 */
export function useRoomCloseEvent(): UseRoomCloseEventReturn {
  const router = useRouter()
  const roomStore = use(RoomStoreContext)
  const { socket } = useSocketService()

  return {
    async handleCloseWaitingRoom() {
      toast.loading("Closing room...", { id: "room:close:waiting" })
  
      try {
        const {
          message,
          description,
          error
        }: SocketResponse = await socket.emitWithAck("room:close:waiting", {})
  
        if (error) {
          throw ServerError.parser(error)
        }
  
        router.replace("/game/setup")
        toast.success(message, { description, id: "room:close:waiting:response" })
      } catch (err) {
        handleServerError(err as ServerError)
        logError(err)
      } finally { toast.dismiss("room:close:waiting") }
    },
  
    async handleCloseCancelledRoom() {
      const room = roomStore?.getState().room
      
      if (!room) {
        toast.warning("Room is not initialized.", {
          description: "You can only do this if you are joining a room.",
          id: "room:close:cancelled"
        })
        return
      }

      toast.loading("Closing session...", { id: "room:close:cancelled" })
  
      try {
        const {
          message,
          description,
          error
        }: SocketResponse = await socket.emitWithAck("room:close:cancelled", {})
  
        if (error) {
          throw ServerError.parser(error)
        }
  
        toast.warning(message, { description, id: "room:close:cancelled:response" })
        router.replace(`/game/summary/${room.slug}`)
      } catch (err) {
        handleServerError(err as ServerError)
        logError(err)
      } finally { toast.dismiss("room:close:cancelled") }
    },
  
    async handleForceCloseRunningRoom() {
      toast.loading("Force closing session...", { id: "room:force_close:running" })
  
      try {
        const {
          error
        }: SocketResponse = await socket.emitWithAck("room:force_close:running", {})
  
        if (error) {
          throw ServerError.parser(error)
        }
      } catch (err) {
        handleServerError(err as ServerError)
        logError(err)
      } finally { toast.dismiss("room:force_close:running") }
    }
  }
}
