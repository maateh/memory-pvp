"use client"

// types
import type { NavGroup as TNavGroup } from "./types"

// config
import { navigation } from "@/config/navigation-settings"

// shadcn
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar"

// components
import { SignedIn } from "@clerk/nextjs"
import NavLinkButton from "./nav-link"

const NavGroup = ({ label, links, isProtected }: TNavGroup) => {
  const group = (
    <SidebarGroup>
      <SidebarGroupLabel>
        {label}
      </SidebarGroupLabel>

      <SidebarMenu>
        {links.map((link) => (
          <NavLinkButton
            link={link}
            key={link.title}
            asChild
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )

  if (isProtected) {
    return (
      <SignedIn>
        {group}
      </SignedIn>
    )
  }

  return group
}

const NavGroups = () => navigation.map((group) => <NavGroup key={group.label} {...group} />)

export default NavGroups
