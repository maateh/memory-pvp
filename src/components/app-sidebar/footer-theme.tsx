"use client"

// hooks
import { useTheme } from "next-themes"

// shadcn
import { SidebarMenuButton } from "@/components/ui/sidebar"

// components
import { ThemeToggle } from "@/components/shared"

const FooterTheme = () => {
  const { theme, setTheme } = useTheme() as UseThemeProps

  return (
    <SidebarMenuButton className="size-fit"
      tooltip={`Switch to ${theme === 'light' ? 'Dark' : 'Light'}`}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      asChild
    >
      <ThemeToggle className="bg-sidebar-primary/15 hover:bg-sidebar-primary/20 dark:bg-sidebar-primary/5 dark:hover:bg-sidebar-primary/10 group-data-[collapsible=icon]:!p-2"
      />
    </SidebarMenuButton>
  )
}

export default FooterTheme
