"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// config
import { offlineSessionMetadata } from "@/config/session-settings"

// utils
import { getSessionFromStorage } from "@/lib/util/storage"

// providers
import { SingleSessionStoreProvider } from "@/components/provider"

// components
import { SessionLoader } from "@/components/session/ingame"
import OfflineGameHandler from "./offline-game-handler"

const OfflineSessionLoader = () => {
  const router = useRouter()
  const session = useRef(getSessionFromStorage())

  useEffect(() => {
    if (!session.current) {
      toast.warning("Offline session cannot be loaded.", {
        description: "Unable to find active offline session.",
        id: '_' /** Note: prevent re-render by adding a custom id. */
      })
      
      router.replace('/game/setup')
    }
  }, [router])

  if (!session.current) {
    return <SessionLoader />
  }

  return (
    <SingleSessionStoreProvider initialSession={{
      ...session.current,
      ...offlineSessionMetadata
    }}>
      <OfflineGameHandler />
    </SingleSessionStoreProvider>
  )
}

export default OfflineSessionLoader
