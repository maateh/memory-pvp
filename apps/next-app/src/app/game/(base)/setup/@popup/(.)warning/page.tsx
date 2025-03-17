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
  ssr: !!false,
  loading: PopupLoader
})

type SessionRunningPopupPageProps = {
  searchParams: Promise<{ format: MatchFormat }>
}

const SessionRunningPopupPage = async ({ searchParams }: SessionRunningPopupPageProps) => {
  const search = await searchParams
  const {
    success
  } = MatchFormatSchema.safeParse(search.format)

  if (!success) {
    return (
      <RedirectFallback
        type="back"
        message="Failed to validate search parameters."
        description="Please do not modify the search parameters manually."
      />
    )
  }

  if (search.format === "OFFLINE") {
    return <OfflineSessionWarningPopup />
  }

  return (
    <SessionRunningPopup
      format={search.format}
      renderer="router"
    />
  )
}

export default SessionRunningPopupPage
