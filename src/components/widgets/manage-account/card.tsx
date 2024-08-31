"use client"

// clerk
import { useClerk } from "@clerk/nextjs"

// prisma
import { User } from "@prisma/client"

// components
import { WidgetCard, type WidgetInfo } from "@/components/widgets"

type ManageAccountWidgetCardProps = {
  user: User
} & WidgetInfo

const ManageAccountWidgetCard = ({ user, ...props }: ManageAccountWidgetCardProps) => {
  const { openUserProfile } = useClerk()

  return (
    <WidgetCard
      widgetAction={openUserProfile}
      {...props}
    >
      <div>
        {user?.username}
      </div>
    </WidgetCard>
  )
}

export default ManageAccountWidgetCard
