"use client"

import dynamic from "next/dynamic"

// clerk
import { useClerk } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/util"

// shadcn
import { SidebarMenuButton } from "@/components/ui/sidebar"

// components
import { UserManageButtonSkeleton } from "@/components/user"

const UserManageButton = dynamic(() => import("@/components/user/user-manage-button"), {
  ssr: false,
  loading: () => <UserManageButtonSkeleton className="bg-sidebar-primary/50 dark:bg-sidebar-primary/15 group-data-[collapsible=icon]:size-7" />
})

const FooterUser = () => {
  const { user } = useClerk()

  return (
    <SidebarMenuButton className={cn("h-10 gap-x-2 border-border/10 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:rounded-full", {
      "bg-sidebar-primary/15 hover:bg-sidebar-primary/20 dark:bg-sidebar-primary/5 dark:hover:bg-sidebar-primary/10": !!user
    })} asChild>
      <UserManageButton
        avatarProps={{
          className: "group-data-[collapsible=icon]:size-7",
          fallbackProps: { className: "group-data-[collapsible=icon]:p-1.5" }
        }}
        usernameProps={{ className: "group-data-[collapsible=icon]:hidden" }}
        showSignInIfLoggedOut
      />
    </SidebarMenuButton>
  )
}

export default FooterUser
