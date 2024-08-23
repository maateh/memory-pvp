"use client"

import Link from "next/link"

// clerk
import { SignedIn } from "@clerk/nextjs"

// constants
import { gamemodes, routes } from "@/constants/navigation"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import SidebarNavigationItem from "@/components/sidebar/sidebar-navigation-item"

const SidebarNavigation = () => {
  return (
    <div className="my-4 flex-1 space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold small-caps">
          Select a gamemode
        </h2>

        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          {gamemodes.map(({ label, href, Icon }) => (
            <Link className={buttonVariants({
              className: "px-2.5 py-1.5 flex items-center justify-center gap-x-2 gap-y-1.5 border-2 last-of-type:col-span-2",
              variant: "outline"
            })}
              href={href}
              key={href}
            >
              <Icon className="size-5" />
              <p className="text-lg small-caps">
                {label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      <ul className="space-y-4">
        <SignedIn>
          {routes.protected.map((route) => (
            <SidebarNavigationItem
              route={route}
              key={route.href}
            />
          ))}
        </SignedIn>

        {routes.public.map((route) => (
          <SidebarNavigationItem
            route={route}
            key={route.href}
          />
        ))}
      </ul>
    </div>
  )
}

export default SidebarNavigation
