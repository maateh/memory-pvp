// types
import type { LucideProps } from "lucide-react"

// utils
import { cn } from "@/lib/utils"

// icons
import { LogIn, UserRound } from "lucide-react"

// shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserAvatarProps = {
  user: ClientUser | null
  imageProps?: React.ComponentProps<typeof AvatarImage>
  fallbackProps?: React.ComponentProps<typeof AvatarFallback>
  fallbackIconProps?: LucideProps
} & React.ComponentProps<typeof Avatar>

const UserAvatar = ({ user, className, imageProps, fallbackProps, fallbackIconProps, ...props }: UserAvatarProps) => {
  return (
    <Avatar className={cn("size-6", className)} {...props}>
      <AvatarImage {...imageProps}
        className={cn("rounded-full", imageProps?.className)}
        src={user?.imageUrl || undefined}
      />
      
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
}

export default UserAvatar
