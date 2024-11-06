// server
import { signedIn } from '@/server/db/signed-in'

// components
import AccountWidgetCard from "./card"

const AccountWidget = async () => {
  const user = await signedIn({ redirectToSignIn: true })
  if (!user) return null

  return <AccountWidgetCard user={user} />
}

export default AccountWidget
