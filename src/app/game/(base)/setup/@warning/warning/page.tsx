import { redirect } from "next/navigation"

const SessionRunningWarningRedirect = () => redirect('/game/setup')

export default SessionRunningWarningRedirect
