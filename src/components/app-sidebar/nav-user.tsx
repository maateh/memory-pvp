"use client"

import { forwardRef } from "react"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { SidebarMenuButton } from "@/components/ui/sidebar"

// components
import { UserManageButton } from "@/components/user"

type NavUserProps = {
  user: ClientUser | null
} & React.ComponentProps<typeof SidebarMenuButton>

const NavUser = forwardRef<HTMLButtonElement, NavUserProps>(({
  user,
  className,
  tooltip,
  ...props
}, ref) => {
  return (
    <SidebarMenuButton className={cn("h-10 gap-x-2 border-border/10 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:rounded-full", {
      "bg-sidebar-primary/15 hover:bg-sidebar-primary/20 dark:bg-sidebar-primary/5 dark:hover:bg-sidebar-primary/10": !!user
    }, className)}
      tooltip={tooltip || user ? "Manage account" : "Sign In"}
      ref={ref}
      asChild
      {...props}
    >
      <UserManageButton
        user={user}
        avatarProps={{
          className: "group-data-[collapsible=icon]:size-7",
          fallbackProps: { className: "group-data-[collapsible=icon]:p-1.5" }
        }}
        usernameProps={{ className: "group-data-[collapsible=icon]:hidden" }}
        showSignInIfLoggedOut
      />
    </SidebarMenuButton>
  )
})
NavUser.displayName = "NavUser"

export default NavUser
