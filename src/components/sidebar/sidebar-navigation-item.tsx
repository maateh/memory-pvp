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
      <Link className={cn("px-3.5 py-2.5 flex items-center justify-between border border-transparent rounded-2xl hover:bg-accent/75 hover:border-accent/85 transition", {
        "bg-accent/75 border border-accent/85": pathname === href
      })}
        href={href}
      >
        <p className="text-xl font-medium">
          {label}
        </p>
        <Icon className="size-5 shrink-0" />
      </Link>
    </li>
  )
}

export default SidebarNavigationItem
