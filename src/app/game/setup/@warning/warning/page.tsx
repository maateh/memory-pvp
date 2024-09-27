import dynamic from "next/dynamic"

// trpc
import { api } from "@/trpc/server"

// components
const SessionRunningWarningModal = dynamic(() => import("./session-warning-modal"), { ssr: false })

type SessionRunningWarningPageProps = {
  searchParams?: {
    sessionId?: string
  }
}

const SessionRunningWarningPage = async ({ searchParams }: SessionRunningWarningPageProps) => { 
  const isOffline = searchParams?.sessionId === 'offline'

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
    return
  }
}

export default SessionRunningWarningPage
