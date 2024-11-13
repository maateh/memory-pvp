"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// types
import type { NavLink as TNavLink } from "./types"

// icons
import { ChevronRight } from "lucide-react"

// shadcn
import { SidebarMenuButton, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

type NavLinkButtonProps = {
  collapsible?: boolean
} & TNavLink & React.ComponentProps<typeof SidebarMenuButton>

const NavLinkButton = ({ title, url, Icon, collapsible = false, ...props }: NavLinkButtonProps) => {
  const pathname = usePathname()

  const content = (
    <>
      {Icon && <Icon />}
      <span>{title}</span>
    </>
  )

  return (
    <SidebarMenuButton
      isActive={pathname.includes(url)}
      tooltip={title}
      {...props}
    >
      {!collapsible ? (
        <Link href={url}>{content}</Link>
      ) : (
        <>
          {content}
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </>
      )}
    </SidebarMenuButton>
  )
}

const NavSubLinkButton = ({ title, url, Icon }: TNavLink) => {
  const pathname = usePathname()

  return (
    <SidebarMenuSubItem key={title}>
      <SidebarMenuSubButton
        isActive={pathname === url}
        asChild
      >
        <Link href={url}>
          <span>{title}</span>
          {Icon && <Icon className="ml-auto" strokeWidth={1.85} />}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export { NavLinkButton, NavSubLinkButton }
