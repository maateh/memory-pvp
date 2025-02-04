import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { WaitingRoom } from "@repo/schema/session-room"
import type { SocketResponse } from "@repo/types/socket-api"
import type { CreateSessionRoomValidation } from "@repo/schema/session-room-validation"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { handleServerError, logError } from "@/lib/util/error"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

export function useCreateWaitingRoom() {
  const router = useRouter()
  const { socket } = useSocketService()

  const execute = async (values: CreateSessionRoomValidation) => {
    toast.loading("Creating room...", { id: "room:create" })

    try {
      const {
        data: room,
        message,
        description,
        error
      }: SocketResponse<WaitingRoom> = await socket?.connect()
        .emitWithAck("room:create", values satisfies CreateSessionRoomValidation)

      if (error || !room) {
        throw SocketError.parser(error)
      }

      router.push(`/dashboard/rooms/${room.slug}`)
      toast.success(message, { description })
    } catch (err) {
      handleServerError(err as SocketError, "Socket service seems to be unavailable. Please try again later.")
      logError(err)
    } finally { toast.dismiss("room:create") }
  }

  return { execute }
}
