"use client"

import { forwardRef } from "react"
import { useRouter } from "next/navigation"

// clerk
import { SignInButton, useClerk } from "@clerk/nextjs"

// utils
import { cn } from "@/lib/utils"

// icons
import { LogIn, LogOut, UserRound, UserRoundCog } from "lucide-react"

// shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarMenuButton } from "@/components/ui/sidebar"

type NavUserAvatarProps = NavUserProps & React.ComponentProps<typeof Avatar>

const NavUserAvatar = ({ user, className, ...props }: NavUserAvatarProps) => {
  return (
    <Avatar className={cn("size-9", className)} {...props}>
      <AvatarImage className="p-1.5 rounded-full group-data-[collapsible=icon]:p-0"
        src={user?.imageUrl || undefined}
      />
      
      <AvatarFallback className="p-1.5 my-auto bg-transparent group-data-[collapsible=icon]:p-0">
        {user ? (
          <UserRound className="size-fit p-0.5 rounded-full group-data-[collapsible=icon]:p-1" />
        ) : (
          <LogIn className="size-4" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}

type NavUserManageButtonProps = NavUserProps & React.ComponentProps<typeof SidebarMenuButton>

const NavUserManageButton = forwardRef<HTMLButtonElement, NavUserManageButtonProps>(({
  user,
  className,
  tooltip,
  ...props
}, ref) => {
  return (
    <SidebarMenuButton className={cn("h-10 flex items-center justify-center gap-x-1 border border-border/10 rounded-2xl bg-sidebar-primary/15 hover:bg-sidebar-primary/20 dark:bg-sidebar-primary/5 dark:hover:bg-sidebar-primary/10", className)}
      tooltip={tooltip || user ? "Manage account" : "Sign In"}
      ref={ref}
      {...props}
    >
      <NavUserAvatar className="group-data-[collapsible=icon]:size-7"
        user={user}
      />

      <span className="mt-0.5 mr-2 font-heading tracking-wide group-data-[collapsible=icon]:hidden">
        {user ? user.username : "Sign In"}
      </span>
    </SidebarMenuButton>
  )
})
NavUserManageButton.displayName = "NavUserManageButton"

type NavUserProps = {
  user: ClientUser | null
}

const NavUser = ({ user }: NavUserProps) => {
  const router = useRouter()
  const { signOut } = useClerk()

  if (!user) {
    return (
      <SignInButton>
        <NavUserManageButton user={user} />
      </SignInButton>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NavUserManageButton user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border/25">
        <DropdownMenuLabel className="flex items-center justify-between gap-x-8">
          <div className="flex items-center gap-x-2">
            <Separator className="h-4 w-1 rounded-full bg-border/50"
              orientation="vertical"
            />

            <p className="pt-0.5 text-base font-normal font-heading tracking-wider">
              {user.username}
            </p>
          </div>

          <NavUserAvatar user={user} />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="muted"
          onClick={() => router.push('/profile/account')} // TODO: create a custom layout for clerk account manage
        >
          <UserRoundCog className="size-4" />
          <span>Manage account</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut()}
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavUser
