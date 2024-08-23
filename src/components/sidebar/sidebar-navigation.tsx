"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// clerk
import { SignedIn } from "@clerk/nextjs"

// constants
import { gamemodes, routes } from "@/constants/navigation"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const SidebarNavigation = () => {
  const pathname = usePathname()

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

      <SignedIn>
        <ul className="space-y-4">
          {[...routes.protected, ...routes.public].map(({ label, href, Icon }) => (
            <li key={href}>
              <Link className={cn("px-3.5 py-2.5 flex items-center justify-between border border-transparent rounded-2xl hover:bg-primary/15 hover:border-primary/20 transition", {
                "bg-primary/5 border border-primary/10": pathname === href
              })}
                href={href}
              >
                <p className="text-xl font-medium">
                  {label}
                </p>
                <Icon className="size-5" />
              </Link>
            </li>
          ))}
        </ul>
      </SignedIn>
    </div>
  )
}

export default SidebarNavigation
