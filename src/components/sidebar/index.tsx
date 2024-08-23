// shadcn
import { Separator } from "@/components/ui/separator"

// components
import SidebarHeader from "@/components/sidebar/sidebar-header"
import SidebarGamemodes from "@/components/sidebar/sidebar-gamemodes"
import SidebarNavigation from "@/components/sidebar/sidebar-navigation"
import SidebarFooter from "@/components/sidebar/sidebar-footer"

const Sidebar = () => {
  return (
    <aside className="h-screen w-full p-4 flex flex-col justify-between bg-secondary/80">
      <SidebarHeader />
      
      <SidebarGamemodes />

      <Separator className="w-3/4 mx-auto my-6" />

      <SidebarNavigation />

      <SidebarFooter />
    </aside>
  )
}

export default Sidebar
