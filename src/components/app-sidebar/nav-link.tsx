"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// types
import type { NavLink as TNavLink } from "./types"

// icons
import { ChevronRight } from "lucide-react"

// shadcn
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"

type NavLinkButtonProps = {
  link: TNavLink
} & React.ComponentProps<typeof SidebarMenuButton>

const NavLinkButton = ({ link, ...props }: NavLinkButtonProps) => {
  const pathname = usePathname()

  const button = (
    <SidebarMenuButton
      isActive={pathname.includes(link.url)}
      tooltip={link.title}
      asChild
      {...props}
    >
      <Link href={link.url}>
        <link.Icon />
        <span>{link.title}</span>
      </Link>
    </SidebarMenuButton>
  )

  // Group is not collapsible
  if (!link.sublinks?.length) {
    return (
      <SidebarMenuItem>
        {button}
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible className="group/collapsible" asChild>
      <SidebarMenuItem>
        {button}

        <CollapsibleTrigger asChild>
          <SidebarMenuAction>
            <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              strokeWidth={2.25}
            />
            <span className="sr-only">Toggle</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>

        <CollapsibleContent className="transition-all">
          <SidebarMenuSub>
            {link.sublinks.map((sublink) => (
              <SidebarMenuSubItem key={sublink.title}>
                <SidebarMenuSubButton
                  isActive={pathname === sublink.url}
                  asChild
                >
                  <Link href={sublink.url}>
                    <span>{sublink.title}</span>
                    <sublink.Icon className="ml-auto" strokeWidth={1.85} />
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export default NavLinkButton
