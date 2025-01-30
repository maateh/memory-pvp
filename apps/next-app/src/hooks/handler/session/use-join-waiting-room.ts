import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { JoinedRoom } from "@repo/schema/session-room"
import type { SocketResponse } from "@repo/types/socket-api"
import type { JoinSessionRoomValidation } from "@repo/schema/session-room-validation"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { handleServerError, logError } from "@/lib/util/error"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

export function useJoinWaitingRoom() {
  const router = useRouter()
  const { socket } = useSocketService()

  const execute = async (values: JoinSessionRoomValidation) => {
    toast.info("Joining room...")

    try {
      const {
        data: room,
        error
      }: SocketResponse<JoinedRoom> = await socket?.connect()
        .emitWithAck("room:join", values satisfies JoinSessionRoomValidation)

      if (error || !room) {
        throw SocketError.parser(error)
      }

      router.push(`/game/${room.slug}`)
      toast.success("Joined successfully!", {
        description: "You will be redirected to the room page."
      })
    } catch (err) {
      handleServerError(err as SocketError, "Socket service seems to be unavailable. Please try again later.")
      logError(err)
    }
  }

  return { execute }
}
