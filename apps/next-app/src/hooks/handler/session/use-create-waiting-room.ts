import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { WaitingRoom } from "@repo/schema/session-room"
import type { ClientPlayer } from "@repo/schema/player"
import type { SocketResponse } from "@repo/types/socket-api"
import type { CreateSessionRoomValidation } from "@repo/schema/session-room-validation"
import type { CreateSessionValidation } from "@/lib/schema/validation/session-validation"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { handleServerError, logError } from "@/lib/util/error"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"

export function useCreateWaitingRoom() {
  const router = useRouter()
  const { socket } = useSocketService()

  const execute = async (values: CreateSessionValidation, activePlayer: ClientPlayer) => {
    toast.info("Creating room...")

    try {
      const {
        data: room,
        error
      }: SocketResponse<WaitingRoom> = await socket?.connect().emitWithAck("room:create", {
        owner: activePlayer,
        settings: values
      } satisfies CreateSessionRoomValidation)

      if (error || !room) {
        throw SocketError.parser(error)
      }

      router.push(`/game/${room.slug}`)
      toast.success("Waiting room created!", {
        description: "You will be redirected to the room page."
      })
    } catch (err) {
      handleServerError(err as SocketError, "Socket service seems to be unavailable. Please try again later.")
      logError(err)
    }
  }

  return { execute }
}
