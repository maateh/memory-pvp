// trpc
import { api } from "@/trpc/server"

// constants
import { manageAccountWidgetInfo } from "./constants"

// components
import ManageAccountWidgetCard from "./card"

const ManageAccountWidget = async () => {
  const user = await api.user.get()

  return (
    <ManageAccountWidgetCard
      user={user}
      {...manageAccountWidgetInfo}
    />
  )
}

export default ManageAccountWidget
