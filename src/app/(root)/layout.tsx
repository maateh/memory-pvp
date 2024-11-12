// shadcn
import { SidebarProvider } from "@/components/ui/sidebar"

// components
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="min-h-screen flex">
      <SidebarProvider>
        <AppSidebar />

        <div className="h-full w-full">
          <div className="w-full">
            <Navbar />
          </div>

          <div className="root-wrapper">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  )
}

export default RootLayout
