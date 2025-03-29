// clerk
import { auth } from "@clerk/nextjs/server"

// shadcn
import { SidebarProvider } from "@/components/ui/sidebar"

// components
import { AppSidebar } from "@/components/app-sidebar"
import { Appbar, AppBreadcrumbs } from "@/components/appbar"

const RootLayout = async ({ children }: React.PropsWithChildren) => {
  const { userId } = await auth()

  return (
    <div className="min-h-screen flex">
      <SidebarProvider open={!userId ? false : undefined}>
        <AppSidebar />

        <div className="h-full w-full flex flex-col">
          {userId && (
            <header className="w-full">
              <Appbar />

              <div className="py-0.5 flex items-center justify-center bg-sidebar border-y border-sidebar-border/10 shadow-xs dark:shadow-lg lg:hidden">
                <AppBreadcrumbs />
              </div>
            </header>
          )}

          <main className="flex-1 root-wrapper">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default RootLayout
