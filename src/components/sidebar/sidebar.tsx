// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SidebarFooter, SidebarGamemodes, SidebarNavigation } from "@/components/sidebar"
import { Logo } from "@/components/shared"

const Sidebar = () => {
  return (
    <aside className="h-screen w-full p-4 flex flex-col justify-between bg-secondary/80">
      <Logo
        withLabel
        withRedirect
      />

      <Separator className="my-4" />
      
      <SidebarGamemodes />

      <Separator className="w-3/4 mx-auto my-6" />

      <SidebarNavigation />

      <SidebarFooter />
    </aside>
  )
}

export default Sidebar
