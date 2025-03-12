import dynamic from "next/dynamic"

// types
import type { MatchFormat } from "@repo/db"

// components
import { PopupLoader } from "@/components/popup"
import { SessionRunningPopup } from "@/components/session/popup"

const OfflineSessionWarningPopup = dynamic(() => import("./offline-session-warning-popup"), {
  ssr: false,
  loading: PopupLoader
})

type SessionRunningPopupPageProps = {
  searchParams: {
    format: MatchFormat
  }
}

const SessionRunningPopupPage = ({ searchParams }: SessionRunningPopupPageProps) => {
  if (searchParams.format === "OFFLINE") {
    return <OfflineSessionWarningPopup />
  }

  return (
    <SessionRunningPopup
      format={searchParams.format}
      renderer="router"
    />
  )
}

export default SessionRunningPopupPage
