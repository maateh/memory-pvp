import dynamic from "next/dynamic"

// types
import type { GameMode } from "@repo/db"

// components
import { PopupLoader } from "@/components/popup"
import { SessionRunningPopup } from "@/components/session/popup"

const OfflineSessionWarningPopup = dynamic(() => import("./offline-session-warning-popup"), {
  ssr: false,
  loading: PopupLoader
})

type SessionRunningPopupPageProps = {
  searchParams: {
    matchFormat: GameMode | "OFFLINE"
  }
}

const SessionRunningPopupPage = ({ searchParams }: SessionRunningPopupPageProps) => {
  if (searchParams.matchFormat === "OFFLINE") {
    return <OfflineSessionWarningPopup />
  }

  return (
    <SessionRunningPopup
      matchFormat={searchParams.matchFormat}
      renderer="router"
    />
  )
}

export default SessionRunningPopupPage
