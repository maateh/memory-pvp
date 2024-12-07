"use client"

// utils
import { getSessionFromStorage } from "@/lib/utils/storage"

// components
import { offlineSessionMetadata } from "@/config/session-settings"
import { SessionRunningPopup } from "@/components/session/popup"
import { RedirectFallback } from "@/components/shared"

const OfflineSessionWarning = () => {
  const session = getSessionFromStorage()

  if (!session) {
    return (
      <RedirectFallback
        type="back"
        message="Offline session cannot be loaded."
        description="Unable to load your active offline session."
      />
    )
  }

  return (
    <SessionRunningPopup
      renderer="router"
      session={{
        ...session,
        ...offlineSessionMetadata
      }}
    />
  )
}

export default OfflineSessionWarning
