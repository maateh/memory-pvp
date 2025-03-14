import dynamic from "next/dynamic"

// types
import type { MatchFormat } from "@repo/db"

// schemas
import { MatchFormatSchema } from "@repo/db/zod"

// components
import { RedirectFallback } from "@/components/shared"
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
  const {
    success,
    data: validatedParams
  } = MatchFormatSchema.safeParse(searchParams.format)

  if (!success || !validatedParams) {
    return (
      <RedirectFallback
        type="back"
        message="Failed to validate search parameters."
        description="Please do not modify the search parameters manually."
      />
    )
  }

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
