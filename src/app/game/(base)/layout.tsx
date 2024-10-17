import Link from "next/link"
import dynamic from "next/dynamic"

// icons
import { Home } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"

// components
const ThemeToggle = dynamic(() => import("@/components/shared/theme-toggle"), { ssr: false })

type BaseGameLayoutProps = {
  children: React.ReactNode
}

const BaseGameLayout = ({ children }: BaseGameLayoutProps) => {
  return (
    <div className="relative flex-1 pt-16 pb-8 px-4 flex flex-col">
      <Link className={buttonVariants({
        className: "bg-destructive/85 rounded-2xl expandable absolute top-3 left-3 sm:top-4 sm:left-4",
        variant: "destructive",
        size: "icon"
      })}
        href="/"
      >
        <Home className="size-4 sm:size-5 shrink-0" />
        <div className="ml-1 sm:ml-1.5">
          Homepage
        </div>
      </Link>

      <ThemeToggle className="p-2 bg-accent/30 absolute top-3 right-3 sm:top-4 sm:right-4"
        variant="ghost"
        expandable="left"
      />

      {children}
    </div>
  )
}

export default BaseGameLayout
