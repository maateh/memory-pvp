import Link from "next/link"

// icons
import { LayoutDashboard } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

const BaseGameLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Button className="bg-accent/30 hover:bg-accent/40 font-normal dark:font-light tracking-wide expandable absolute top-3 left-3 sm:top-4 sm:left-4"
        variant="ghost"
        size="icon"
        asChild
      >
        <Link href="/">
          <LayoutDashboard className="size-4 sm:size-5 shrink-0" />
          <div className="ml-1 sm:ml-1.5">
            Dashboard
          </div>
        </Link>
      </Button>

      <div className="flex-1 pt-16 pb-8 px-4 flex flex-col">
        {children}
      </div>
    </>
  )
}

export default BaseGameLayout
