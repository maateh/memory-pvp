import Link from "next/link"
import dynamic from "next/dynamic"

// icons
import { LayoutDashboard } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { ThemeToggleSkeleton } from "@/components/shared"

const ThemeToggle = dynamic(() => import("@/components/shared/theme-toggle"), {
  ssr: false,
  loading: () => <ThemeToggleSkeleton className="bg-accent/30 rounded-full absolute top-3 right-3 sm:top-4 sm:right-4" />
})

type BaseGameLayoutProps = {
  children: React.ReactNode
}

const BaseGameLayout = ({ children }: BaseGameLayoutProps) => {
  return (
    <div className="relative flex-1 pt-16 pb-8 px-4 flex flex-col">
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

      <ThemeToggle className="p-2 bg-accent/30 hover:bg-accent/40 absolute top-3 right-3 sm:top-4 sm:right-4"
        variant="ghost"
        expandable="left"
      />

      {children}
    </div>
  )
}

export default BaseGameLayout
