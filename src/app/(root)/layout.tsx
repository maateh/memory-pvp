// shadcn
import { SidebarProvider } from "@/components/ui/sidebar"

// components
import { AppSidebar } from "@/components/app-sidebar"
import { Appbar } from "@/components/appbar"

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="min-h-screen flex">
      <SidebarProvider>
        <AppSidebar />

        <div className="h-full w-full flex flex-col">
          <header className="w-full">
            <Appbar />
          </header>

          <main className="flex-1 root-wrapper">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default RootLayout
