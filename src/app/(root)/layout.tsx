// shadcn
import { SidebarProvider } from "@/components/ui/sidebar"

// components
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"
import { SignedIn } from "@/components/shared"

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="min-h-screen flex">
      <SidebarProvider>
        <AppSidebar />

        <div className="h-full w-full">
          <SignedIn>
            <div className="w-full">
              <Navbar />
            </div>
          </SignedIn>

          <div className="root-wrapper">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  )
}

export default RootLayout
