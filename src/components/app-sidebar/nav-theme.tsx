"use client"

import dynamic from "next/dynamic"

// hooks
import { useTheme } from "next-themes"
import { useSidebar } from "@/components/ui/sidebar"

// components
const ThemeToggle = dynamic(() => import("@/components/shared/theme-toggle"), { ssr: false })

const NavTheme = () => {
  const { state } = useSidebar()
  const { theme } = useTheme() as UseThemeProps

  return (
    <ThemeToggle className="group-data-[collapsible=icon]:!expandable group-data-[collapsible=icon]:!p-2"
      expandable={state === 'expanded' ? 'right' : 'none'}
      title={state === 'collapsed' ? `Switch to ${theme === 'light' ? 'Dark' : 'Light'}` : ''}
    />
  )
}

export default NavTheme
