"use client"

// clerk
import { useClerk } from "@clerk/nextjs"

// icons
import { LogOut, Mail, UserRoundCog } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

// components
import { UserInfo } from "@/components/user"

const UserManagePopover = ({ ...props }: React.ComponentProps<typeof PopoverTrigger>) => {
  const { user, openUserProfile, signOut } = useClerk()
  if (!user) return null
  
  const email = user.emailAddresses[0].emailAddress

  // TODO: create a drawer for mobile screens
  return (
    <Popover>
      <PopoverTrigger {...props} />

      <PopoverContent className="pt-5 pb-3 mx-2.5 border-border/25 rounded-xl">
        <h3 className="text-lg sm:text-xl font-heading heading-decorator subheading">
          Your Account
        </h3>

        <p className="text-sm text-muted-foreground font-light">
          Manage your account with Clerk.
        </p>

        <Separator className="mt-3.5 mb-2.5 bg-border/25" />

        <div className="space-y-2.5">
          <UserInfo
            label="Username"
            info={user.username || email.split('@')[0]}
            user={{
              username: user.username!,
              imageUrl: user.imageUrl,
              createdAt: user.createdAt || new Date()
            }}
            showUserAvatarAsIcon
          />

          <UserInfo
            label="Email"
            info={email}
            Icon={Mail}
            hideInfo
          />
        </div>

        <Separator className="mt-3.5 mb-2.5 bg-border/25" />

        <div className="flex items-center justify-between gap-x-4 gap-y-1.5">
          <Button className="flex-1 flex items-center justify-center gap-x-1.5 border border-border/10 rounded-xl font-normal bg-accent/15 hover:bg-accent/20 dark:bg-accent/10 dark:hover:bg-accent/15"
            variant="ghost"
            onClick={() => openUserProfile()}
          >
            <UserRoundCog className="size-4" />
            <span>Manage</span>
          </Button>

          <Button className="flex-1 flex items-center justify-center gap-x-1.5 border border-border/10 rounded-xl font-normal bg-destructive/15 hover:bg-destructive/20 dark:bg-destructive/15 dark:hover:bg-destructive/20"
            variant="ghost"
            onClick={() => signOut()}
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default UserManagePopover
