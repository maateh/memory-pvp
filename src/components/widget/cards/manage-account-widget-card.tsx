// icons
import { UserCircle } from "lucide-react"

// components
import { WidgetCard } from "@/components/widget"

const ManageAccountWidgetCard = () => {
  return (
    <WidgetCard
      widgetKey="manageAccount"
      title="Your Account"
      description="Manage your account with Clerk."
      icon={<UserCircle />}
    >
      <div>Display account info</div>
    </WidgetCard>
  )
}

export default ManageAccountWidgetCard
