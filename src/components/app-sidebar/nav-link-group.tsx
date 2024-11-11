"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// types
import type { NavLink as TNavLink } from "./types"

// constants
import { navigation } from "@/constants/navigation"

// icons
import { ChevronRight } from "lucide-react"

// shadcn
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"

const NavLinkGroup = () => {
  return navigation.map(({ label, links }) => (
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
                  {link.sublinks.map((sublink) => <NavSubLink key={sublink.title} {...sublink} />)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ))
}

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

const NavSubLink = ({ title, url, Icon }: TNavLink) => {
  const pathname = usePathname()

  return (
    <SidebarMenuSubItem key={title}>
      <SidebarMenuSubButton
        isActive={pathname.includes(url)}
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

export default NavLinkGroup
