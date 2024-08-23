"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// constants
import { type routes } from "@/constants/navigation"

// utils
import { cn } from "@/lib/utils"

type Route = typeof routes.public[number]

type SidebarNavigationItemProps = {
  route: Route
}

const SidebarNavigationItem = ({ route }: SidebarNavigationItemProps) => {
  const pathname = usePathname()

  const { label, href, Icon } = route

  return (
    <li>
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
  )
}

export default SidebarNavigationItem
