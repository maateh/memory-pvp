"use client"

import { useState } from "react"

// types
import type { LucideIcon, LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// icons
import { Check, Copy, Slash } from "lucide-react"

// components
import { UserAvatar } from "@/components/user"

type UserInfoProps = {
  label: string
  info: string
  Icon?: LucideIcon
  iconProps?: LucideProps
  avatarProps?: Omit<React.ComponentProps<typeof UserAvatar>, 'user'>
  hideInfo?: boolean
} & ({
  showUserAvatarAsIcon: boolean
  user: ClientUser
} | {
  showUserAvatarAsIcon?: never
  user?: never
})

const UserInfo = ({
  label,
  info,
  Icon,
  iconProps,
  hideInfo = false,
  user,
  showUserAvatarAsIcon = false,
  avatarProps
}: UserInfoProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(info)
    setCopied(true)

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-x-2.5">
      {Icon && (
        <Icon {...iconProps}
          className={cn("size-6 sm:size-5 shrink-0", iconProps?.className)}
        />
      )}

      {showUserAvatarAsIcon && user && (
        <UserAvatar {...avatarProps}
          className={cn("size-6 sm:size-5", avatarProps?.className)}
          user={user}
        />
      )}

      <div className="flex items-center gap-x-3.5">
        <div className="font-mono">
          <span className="text-muted-foreground">{label}</span>

          <Slash className="inline size-3 shrink-0 mx-1 text-muted-foreground -rotate-[35deg]" />

          <span className={cn("cursor-pointer break-all", {
            "blur-sm hover:blur-none transition": hideInfo && !copied
          })}
            onClick={handleCopy}
          >
            {info}
          </span>
        </div>

        <div className="relative">
          <Copy className={cn("size-3 shrink-0 cursor-pointer transition-all duration-200", {
            "rotate-0 scale-100": !copied,
            "-rotate-90 scale-0": copied
          })}
            onClick={handleCopy}
          />

          <Check className={cn("size-3 shrink-0 cursor-pointer transition-all duration-200 absolute right-0 top-0", {
            "rotate-0 scale-100": copied,
            "-rotate-90 scale-0": !copied
          })}
            onClick={handleCopy}
          />
        </div>
      </div>

    </div>
  )
}

export default UserInfo
