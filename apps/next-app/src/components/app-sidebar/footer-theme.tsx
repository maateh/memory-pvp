import dynamic from "next/dynamic"

// shadcn
import { SidebarMenuButton } from "@/components/ui/sidebar"

// components
import { ThemeToggleSkeleton } from "@/components/shared"

const ThemeToggle = dynamic(() => import("@/components/shared/theme-toggle"), {
  ssr: !!false,
  loading: () => <ThemeToggleSkeleton className="bg-sidebar-primary/50 dark:bg-sidebar-primary/15" />
})

const FooterTheme = () => {
  return (
    <SidebarMenuButton className="size-fit" asChild>
      <ThemeToggle className="bg-sidebar-primary/15 hover:bg-sidebar-primary/20 dark:bg-sidebar-primary/5 dark:hover:bg-sidebar-primary/10 group-data-[collapsible=icon]:!p-2"
        showTooltip
      />
    </SidebarMenuButton>
  )
}

export default FooterTheme
