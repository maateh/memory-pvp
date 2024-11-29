"use client"

// utils
import { getSessionFromStorage } from "@/lib/utils/storage"

// components
import { offlineSessionMetadata } from "@/constants/session"
import { SessionRunningPopup } from "@/components/session/popup"
import { PopupRedirectFallback } from "@/components/popup"

const OfflineSessionWarning = () => {
  const session = getSessionFromStorage()

  if (!session) {
    return (
      <PopupRedirectFallback
        message="Popup cannot be loaded."
        description="Unable to find active offline session."
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
