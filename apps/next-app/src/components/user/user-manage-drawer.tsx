"use client"

import { useState } from "react"

// clerk
import { useClerk } from "@clerk/nextjs"

// icons
import { LogOut, Mail, UserRoundCog } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

// components
import { UserInfo } from "@/components/user"

const UserManageDrawer = ({ ...props }: React.ComponentProps<typeof DrawerTrigger>) => {
  const [open, setOpen] = useState<boolean>(false)

  const { user, openUserProfile, signOut } = useClerk()
  if (!user) return null

  const email = user.emailAddresses[0].emailAddress

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger {...props} />

      <DrawerContent className="border-border/25">
        <DrawerHeader className="gap-y-0">
          <DrawerTitle className="mt-2 text-2xl font-heading heading-decorator">
            Your Account
          </DrawerTitle>

          <DrawerDescription className="text-start text-sm text-muted-foreground font-light">
            Manage your account with Clerk.
          </DrawerDescription>
        </DrawerHeader>

        <Separator className="w-5/6 mx-auto mb-5 bg-border/15" />

        <div className="px-6 flex flex-col justify-center gap-y-4">
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

        <Separator className="w-5/6 mx-auto mt-5 bg-border/15" />

        <DrawerFooter className="flex-wrap flex-row items-center justify-center gap-x-4 gap-y-1.5">
          <Button className="flex-1 w-full max-w-64 px-6 flex items-center justify-center gap-x-1.5 border border-border/10 rounded-xl font-normal bg-accent/15 hover:bg-accent/20 dark:bg-accent/10 dark:hover:bg-accent/15"
            variant="ghost"
            onClick={() => {
              openUserProfile()
              setOpen(false)
            }}
          >
            <UserRoundCog className="size-4 shrink-0" />
            <span>Manage</span>
          </Button>

          <Button className="flex-1 w-full max-w-64 px-6 flex items-center justify-center gap-x-1.5 border border-border/10 rounded-xl font-normal bg-destructive/15 hover:bg-destructive/20 dark:bg-destructive/15 dark:hover:bg-destructive/20"
            variant="ghost"
            onClick={() => signOut()}
          >
            <LogOut className="size-4 shrink-0" />
            <span>Sign Out</span>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default UserManageDrawer
