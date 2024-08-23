// components
import SidebarHeader from "@/components/sidebar/sidebar-header"
import SidebarFooter from "@/components/sidebar/sidebar-footer"
import SidebarNavigation from "@/components/sidebar/sidebar-navigation"

const Sidebar = () => {
  return (
    <aside className="h-screen w-full p-4 flex flex-col justify-between bg-secondary/80">
      <SidebarHeader />
      
      <SidebarNavigation />

      <SidebarFooter />
    </aside>
  )
}

export default Sidebar
