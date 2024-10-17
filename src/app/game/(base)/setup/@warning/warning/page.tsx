import dynamic from "next/dynamic"

// trpc
import { api } from "@/trpc/server"

// utils
import { logError } from "@/lib/utils"

// components
const SessionRunningWarningModal = dynamic(() => import("./session-warning-modal"), { ssr: false })

type SessionRunningWarningPageProps = {
  searchParams?: {
    slug?: string
  }
}

const SessionRunningWarningPage = async ({ searchParams }: SessionRunningWarningPageProps) => { 
  const isOffline = searchParams?.slug === 'offline'

  try {
    let clientSession: ClientGameSession | null = null
    if (!isOffline) {
      clientSession = await api.session.getActive()
    }
  
    return (
      <SessionRunningWarningModal
        session={clientSession}
        isOffline={isOffline}
      />
    )
  } catch (err) {
    logError(err)
  }
}

export default SessionRunningWarningPage
