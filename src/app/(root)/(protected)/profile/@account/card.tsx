"use client"

import Image from "next/image"

// clerk
import { useClerk } from "@clerk/nextjs"

// prisma
import { User } from "@prisma/client"

// constants
import { manageAccountWidgetInfo } from "@/components/widgets/constants"

// icons
import { Mail, SquareUser } from "lucide-react"

// components
import { WidgetCard } from "@/components/widgets"
import UserInfoItem from "./user-info-item"

type AccountWidgetCardProps = {
  user: User
}

const AccountWidgetCard = ({ user }: AccountWidgetCardProps) => {
  const { openUserProfile } = useClerk()

  return (
    <WidgetCard
      widgetAction={openUserProfile}
      {...manageAccountWidgetInfo}
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
                height={32}
                width={32}
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

export default AccountWidgetCard