import type { LucideIcon } from "lucide-react"

export type NavGroup = {
  label: string
  links: NavLink[]
  isProtected: boolean
}

export type NavLink = {
  title: string
  Icon: LucideIcon
  url: string
  sublinks?: NavLink[]
}
