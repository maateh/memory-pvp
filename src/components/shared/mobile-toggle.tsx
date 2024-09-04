// icons
import { Menu } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// components
import { Sidebar } from "@/components/sidebar"

const MobileToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="p-1.5 md:hidden"
          variant="ghost"
          size="icon"
        >
          <Menu className="size-6 sm:size-7 shrink-0"
            strokeWidth={3}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 flex gap-0"
        side="left"
      >
        <SheetTitle className="sr-only">
          Sidebar
        </SheetTitle>
        <SheetDescription className="sr-only">
          Sidebar for mobile navigation
        </SheetDescription>

        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle
