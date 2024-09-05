// trpc
import { api } from "@/trpc/server"

// components
import ManageAccountWidgetCard from "./card"

const ManageAccountWidget = async () => {
  const user = await api.user.get()

  return <ManageAccountWidgetCard user={user} />
}

export default ManageAccountWidget
