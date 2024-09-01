"use client"

import Image from "next/image"

// clerk
import { useClerk } from "@clerk/nextjs"

// prisma
import { User } from "@prisma/client"

// icons
import { Mail, SquareUser } from "lucide-react"

// components
import { WidgetCard, type WidgetInfo } from "@/components/widgets"
import UserInfoItem from "./user-info-item"

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
      <h4 className="mt-2 mb-5 w-fit border-t border-t-accent text-lg font-heading font-semibold small-caps">
        Account details
      </h4>

      <div className="space-y-6">
        <UserInfoItem
          label="Username"
          info={`@${user.username}`}
          icon={!user.imageUrl ? <SquareUser className="size-7" /> : (
            <div className="size-8 rounded-2xl img-wrapper">
              <Image
                src={user.imageUrl}
                alt="user avatar"
                sizes="32px"
                fill
              />
            </div>
          )}
        />

        <UserInfoItem
          label="Email"
          info={user.email}
          icon={<Mail className="size-7" />}
        />
      </div>
    </WidgetCard>
  )
}

export default ManageAccountWidgetCard
