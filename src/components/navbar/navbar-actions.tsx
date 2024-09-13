"use client"

import { useRouter } from "next/navigation"

// utils
import { cn } from "@/lib/utils"

// icons
import { History, Plus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

type NavbarActionsProps = {
  hasActivePlayer: boolean
}

const NavbarActions = ({ hasActivePlayer }: NavbarActionsProps) => {
  const router = useRouter()

  return (
    <div className={cn("flex items-center gap-x-5", {
      "flex-1 justify-between": !hasActivePlayer
    })}>
      <Button className={cn("h-fit py-1.5 gap-x-2 bg-accent/30 hidden xl:flex hover:bg-accent/35", {
        "flex": !hasActivePlayer
      })}
        onClick={() => router.push('/profile/players')}
      >
        <Plus className="size-4" strokeWidth={4} />
        New player
      </Button>

      <Button className={cn("h-fit py-1.5 gap-x-2 hidden 2xl:flex", {
        "lg:flex": !hasActivePlayer
      })}
        onClick={() => router.push('/dashboard/sessions')}
      >
        <History className="size-4" strokeWidth={2.5} />
        Game sessions
      </Button>
    </div>
  )
}

export default NavbarActions
