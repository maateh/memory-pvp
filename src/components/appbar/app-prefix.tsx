"use client"

import Link from "next/link"

// utils
import { cn } from "@/lib/utils"

// icons
import { Spade } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// components
import { AppBreadcrumbs } from "@/components/appbar"

// hooks
import { useSidebar } from "@/components/ui/sidebar"

const AppPrefix = () => {
  const { state, isMobile } = useSidebar()

  return (
    <div className={cn("h-full flex items-center gap-x-1.5 transition-all duration-300 lg:flex-1", {
      "flex-1": state === 'collapsed' || isMobile
    })}>
      <SidebarTrigger className="size-8 hover:bg-accent/10 dark:hover:bg-accent/5" />

      <Separator className="h-5 w-1 bg-primary-foreground/15 rounded-sm"
        orientation="vertical"
      />

      <AppBreadcrumbs className="hidden lg:flex" />

      <Link className={cn(buttonVariants({
        className: cn("flex px-2.5 py-1 gap-x-2 animate-in slide-in-from-left duration-300 hover:bg-accent/10 dark:hover:bg-accent/5 lg:hidden", {
          "hidden": state === 'expanded' && !isMobile
        }),
        variant: "ghost",
        size: "icon"
      }))}
        href="/"
      >
        <Spade className="size-4 sm:size-5" strokeWidth={2.5} />
        <p className="text-lg sm:text-xl font-heading font-medium tracking-wide">
          memory/pvp
        </p>
      </Link>
    </div>
  )
}

export default AppPrefix
