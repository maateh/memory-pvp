import Image from "next/image"

// types
import type { LucideProps } from "lucide-react"
import type { ClientUser } from "@/lib/types/client"

// utils
import { cn } from "@/lib/util"

// icons
import { LogIn, UserRound } from "lucide-react"

// shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// components
import { CustomTooltip } from "@/components/shared"

type UserAvatarProps = {
  user: Pick<ClientUser, 'imageUrl' | 'username'> | null
  imageSize?: number
  imageProps?: React.ComponentProps<typeof AvatarImage>
  fallbackProps?: React.ComponentProps<typeof AvatarFallback>
  fallbackIconProps?: LucideProps
  showTooltip?: boolean
} & React.ComponentProps<typeof Avatar>

const UserAvatar = ({
  user,
  imageSize = 32,
  imageProps,
  fallbackProps,
  fallbackIconProps,
  showTooltip = false,
  className,
  ...props
}: UserAvatarProps) => {
  const avatar = (
    <Avatar className={cn("size-6 img-wrapper", className)} {...props}>
      <AvatarImage {...imageProps}
        className={cn("rounded-full", imageProps?.className)}
        src={user?.imageUrl || undefined}
        asChild
      >
        {user && user.imageUrl && (
          <Image
            src={user.imageUrl}
            alt={`${user.username}'s avatar`}
            height={imageSize}
            width={imageSize}
          />
        )}
      </AvatarImage>
      
      <AvatarFallback {...fallbackProps}
        className={cn("my-auto p-1 bg-transparent", fallbackProps?.className)}
      >
        {user ? (
          <UserRound {...fallbackIconProps}
            className={cn("size-fit rounded-full", fallbackIconProps?.className)}
          />
        ) : (
          <LogIn className="size-fit" />
        )}
      </AvatarFallback>
    </Avatar>
  )

  if (!showTooltip || !user) return avatar
  return (
    <CustomTooltip tooltip={user.username} asChild>
      {avatar}
    </CustomTooltip>
  )
}

export default UserAvatar
