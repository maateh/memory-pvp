"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// hooks
import { useGameStore } from "@/hooks/use-game-store"

const GameOfflineSavePage = () => {
  const router = useRouter()

  const clientSession = useGameStore((state) => state.get)()

  // TODO: add endpoint
  // const saveOfflineSession = api.game.saveOffline.useMutation({
  //   onSuccess: () => {
  //     toast.success('Your offline session has been saved.')
  //     router.replace('/dashboard')
  //   },
  //   onError: () => {
  //     toast.error('Something went wrong.')
  //   }
  // })

  useEffect(() => {
    if (!clientSession) {
      router.replace('/dashboard')
      return
    }

    // saveOfflineSession.mutate(clientSession)
  }, [router, /*saveOfflineSession*/, clientSession])

  return (
    <>TODO: loading skeleton</>
  )
}

export default GameOfflineSavePage
