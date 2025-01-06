import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { CreateSessionValidation } from "@/lib/schema/validation/session-validation"

// hooks
import { useSocketService } from "@/components/provider/socket-service-provider"
import { useCacheStore } from "@/hooks/store/use-cache-store"

export function useCreateWaitingRoom() {
  const router = useRouter()
  const { socket } = useSocketService()
  
  const setCache = useCacheStore<{
    room: {} // TODO: create `SessionRoom` type
  }, 'set'>((state) => state.set)

  const execute = async (values: CreateSessionValidation) => {
    toast.info("Creating room...")

    try {
      const { room, status } = await socket?.connect().timeout(5000).emitWithAck("room:create", {
        // owner: TODO: get active player
        settings: values
      }) as {
        room: {} // TODO: create `SessionRoom` type
        status: "success" | "error"
      }

      if (status === "error") {
        throw new Error("TODO: handle socket response error")
      }

      setCache({ room })
      router.push("/game/multi")
      toast.success("Waiting room created!", {
        description: "You will be redirected to the room page."
      })
    } catch (err) {
      // TODO: handle socket error
      console.error(err)

      toast.error("Socket server is not available.", {
        description: "Service seems to be unavailable. Please try again later."
      })
    }
  }

  return { execute }
}
