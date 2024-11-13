import { forwardRef } from "react"

// clerk
import { SignInButton } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { UserAvatar, UserManageDropdown } from "@/components/user"

type UserManageButtonProps = {
  user: ClientUser | null
  showSignInIfLoggedOut?: boolean
  avatarProps?: Omit<React.ComponentProps<typeof UserAvatar>, 'user'>
  usernameProps?: React.ComponentProps<"span">
} & React.ComponentProps<typeof Button>

const UserManageButton = forwardRef<HTMLButtonElement, UserManageButtonProps>(({
  user,
  showSignInIfLoggedOut,
  avatarProps,
  usernameProps,
  className,
  variant = "ghost",
  ...props
}, ref) => {
  const button = (
    <Button className={cn("flex items-center justify-center gap-x-1.5 border border-border/20 rounded-2xl bg-accent/15 hover:bg-accent/20 dark:bg-accent/5 dark:hover:bg-accent/10", {
      "bg-destructive/25 hover:bg-destructive/30 dark:bg-destructive/20 dark:hover:bg-destructive/25": !user
    }, className)}
      ref={ref}
      {...props}
    >
      <UserAvatar user={user} {...avatarProps} />

      <span {...usernameProps}
        className={cn("mt-0.5 font-heading tracking-wide", usernameProps?.className)}
      >
        {user ? user.username : "Sign In"}
      </span>
    </Button>
  )

  if (!user && showSignInIfLoggedOut) {
    return (
      <SignInButton>
        {button}
      </SignInButton>
    )
  }

  if (!user) return null

  return (
    <UserManageDropdown user={user} asChild>
      {button}
    </UserManageDropdown>
  )
})
UserManageButton.displayName = "UserManageButton"

export default UserManageButton
