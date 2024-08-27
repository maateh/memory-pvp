// shadcn
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

// components
import { Sidebar } from "@/components/sidebar"

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="min-h-screen flex">
      <div className="z-50 hidden h-full w-72 fixed inset-y-0 md:flex lg:w-80">
        <Sidebar />
      </div>

      <div className="h-full w-full md:ml-72 lg:ml-80">
        {children}
      </div>
    </main>
  )
}

export default RootLayout
