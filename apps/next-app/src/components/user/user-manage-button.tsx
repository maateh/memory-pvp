"use client"

import { forwardRef } from "react"

// types
import type { ClerkUser } from "@/lib/types/clerk"

// clerk
import { SignInButton, useClerk } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { UserAvatar, UserManageDrawer, UserManagePopover } from "@/components/user"

// hooks
import { useIsMobile } from "@/hooks/use-is-mobile"

type UserManageButtonProps = {
  showSignInIfLoggedOut?: boolean
  avatarProps?: Omit<React.ComponentProps<typeof UserAvatar>, 'user'>
  usernameProps?: React.ComponentProps<"span">
} & React.ComponentProps<typeof Button>

const UserManageButton = forwardRef<HTMLButtonElement, UserManageButtonProps>(({
  showSignInIfLoggedOut,
  avatarProps,
  usernameProps,
  className,
  variant = "ghost",
  ...props
}, ref) => {
  const { user } = useClerk()
  const isMobile = useIsMobile()

  const button = (
    <Button className={cn("flex items-center justify-center gap-x-1.5 border border-border/20 rounded-2xl bg-accent/15 hover:bg-accent/20 dark:bg-accent/5 dark:hover:bg-accent/10", {
      "bg-destructive/25 hover:bg-destructive/30 dark:bg-destructive/20 dark:hover:bg-destructive/25": !user
    }, className)}
      ref={ref}
      {...props}
    >
      <UserAvatar
        user={user as ClerkUser}
        {...avatarProps}
      />

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

  return isMobile ? (
    <UserManageDrawer asChild>
      {button}
    </UserManageDrawer>
  ) : (
    <UserManagePopover asChild>
      {button}
    </UserManagePopover>
  )
})
UserManageButton.displayName = "UserManageButton"

const UserManageButtonSkeleton = ({ className, ...props }: React.ComponentProps<typeof Skeleton>) => (
  <Skeleton className={cn("h-10 w-full bg-border/50 rounded-xl", className)}
    {...props}
  />
)

export default UserManageButton
export { UserManageButtonSkeleton }
