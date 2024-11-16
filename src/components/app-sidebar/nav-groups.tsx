"use client"

// types
import type { NavGroup as TNavGroup } from "./types"

// constants
import { navigation } from "@/constants/navigation"

// shadcn
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub
} from "@/components/ui/sidebar"

// components
import { SignedIn } from "@clerk/nextjs"
import { NavLinkButton, NavSubLinkButton } from "./nav-link"

const NavGroup = ({ label, links, isProtected }: TNavGroup) => {
  const content = (
    <SidebarGroup key={label}>
      <SidebarGroupLabel>
        {label}
      </SidebarGroupLabel>

      <SidebarMenu>
        {links.map((link) => !link.sublinks?.length ? (
          <NavLinkButton {...link}
            key={link.title}
            asChild
          />
        ) : (
          <Collapsible className="group/collapsible"
            key={link.title}
            defaultOpen
            asChild
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <NavLinkButton {...link} collapsible />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {link.sublinks.map((sublink) => (
                    <NavSubLinkButton key={sublink.title} {...sublink} />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )

  if (isProtected) {
    return (
      <SignedIn>
        {content}
      </SignedIn>
    )
  }

  return content
}

const NavGroups = () => navigation.map((group) => <NavGroup key={group.label} {...group} />)

export default NavGroups