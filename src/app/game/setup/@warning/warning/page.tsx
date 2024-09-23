import dynamic from "next/dynamic"

// components
const SessionRunningWarningModal = dynamic(() => import("./session-warning-modal"), { ssr: false })

type SessionRunningWarningPageProps = {
  searchParams?: {
    sessionId?: string
  }
}

const SessionRunningWarningPage = async ({ searchParams }: SessionRunningWarningPageProps) => { 
  const isOffline = searchParams?.sessionId === 'offline'

  let session = null
  if (!isOffline) {
    // TODO: fetch session by sessionId
  }

  return (
    <SessionRunningWarningModal
      session={session}
      isOffline={isOffline}
    />
  )
}

export default SessionRunningWarningPage
