// api
import { api } from "@/trpc/server"

// icons
import { UserCircle } from "lucide-react"

// components
import { type WidgetInfo } from "@/components/widgets"
import ManageAccountWidgetCard from "./card"

const widgetInfo: WidgetInfo = {
  title: "Your Account",
  description: "Manage your account with Clerk.",
  icon: <UserCircle />
}

const ManageAccountWidget = async () => {
  const user = await api.user.get()

  return <ManageAccountWidgetCard user={user!} {...widgetInfo} />
}

export default ManageAccountWidget
