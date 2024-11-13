"use client"

import { useRouter } from "next/navigation"

// clerk
import { useClerk } from "@clerk/nextjs"

// icons
import { LogOut, UserRoundCog } from "lucide-react"

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// components
import { UserAvatar } from "@/components/user"

type UserManageDropdownProps = {
  user: ClientUser
} & React.ComponentProps<typeof DropdownMenuTrigger>

const UserManageDropdown = ({ user, ...props }: UserManageDropdownProps) => {
  const router = useRouter()
  const { signOut } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props} />

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

          <UserAvatar user={user} />
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

export default UserManageDropdown
