// shadcn
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

// components
import { Sidebar } from "@/components/sidebar"

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="min-h-screen">
      <ResizablePanelGroup className="flex" direction="horizontal">
        <ResizablePanel className="hidden min-w-64 md:flex xl:min-w-fit"
          defaultSize={18}
          minSize={10}
          maxSize={22.5}
        >
          <Sidebar />
        </ResizablePanel>

        <ResizableHandle className="hidden xl:flex" withHandle />

        <ResizablePanel
          defaultSize={82}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}

export default RootLayout
