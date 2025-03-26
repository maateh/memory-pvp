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

type UseRoomLeaveEventReturn = {
  handleLeaveRoom: () => Promise<void>
}

/**
 * TODO: write doc
 * 
 * @returns 
 */
export function useRoomLeaveEvent(): UseRoomLeaveEventReturn {
  const router = useRouter()
  const { socket } = useSocketService()

  return {
    async handleLeaveRoom() {
      toast.loading("Leaving room...", { id: "room:leave" })

      try {
        const {
          message,
          description,
          error
        }: SocketResponse = await socket.emitWithAck("room:leave", {})
  
        if (error) {
          throw ServerError.parser(error)
        }
  
        router.replace("/dashboard/rooms")
        toast.success(message, { description })
      } catch (err) {
        handleServerError(err as ServerError)
        logError(err)
      } finally { toast.dismiss("room:leave") }
    }
  }
}
