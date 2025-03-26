import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { SocketResponse } from "@repo/server/socket-types"

// server
import { ServerError } from "@repo/server/error"

// utils
import { handleServerError, logError } from "@/lib/util/error"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"
import { useRoomStore } from "@/components/provider/room-store-provider"

type UseRoomCloseEventReturn = {
  handleCloseWaitingRoom: () => Promise<void>
  handleCloseCancelledRoom: () => Promise<void>
  handleForceCloseRunningRoom: () => Promise<void>
}

/**
 * TODO: write doc
 * 
 * @returns 
 */
export function useRoomCloseEvent(): UseRoomCloseEventReturn {
  const router = useRouter()
  const { socket } = useSocketService()
  const room = useRoomStore((state) => state.room)

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
          message,
          description,
          error
        }: SocketResponse = await socket.emitWithAck("room:force_close:running", {})
  
        if (error) {
          throw ServerError.parser(error)
        }
  
        toast.warning(message, { description, id: "room:force_close:running:response" })
        router.replace(`/game/summary/${room.slug}`)
      } catch (err) {
        handleServerError(err as ServerError)
        logError(err)
      } finally { toast.dismiss("room:force_close:running") }
    }
  }
}
