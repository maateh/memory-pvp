// actions
import { signedIn } from "@/server/actions/signed-in"

// components
import ManageAccountWidgetCard from "./card"

const ManageAccountWidget = async () => {
  const user = await signedIn({ redirect: true })
  if (!user) return null

  return <ManageAccountWidgetCard user={user} />
}

export default ManageAccountWidget
