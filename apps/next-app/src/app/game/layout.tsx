import dynamic from "next/dynamic"

// components
import { ThemeToggleSkeleton } from "@/components/shared"

const ThemeToggle = dynamic(() => import("@/components/shared/theme-toggle"), {
  ssr: !!false,
  loading: () => <ThemeToggleSkeleton className="bg-accent/30 rounded-full absolute top-3 right-3 sm:top-4 sm:right-4" />
})

const GameLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen p-1 mx-auto flex flex-col md:p-2 md:max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-2xl)">
      <div className="relative flex-1 flex bg-primary border-2 border-border/15 rounded-lg md:rounded-2xl">
        <ThemeToggle className="p-2 bg-accent/30 hover:bg-accent/40 absolute top-3 right-3 sm:top-4 sm:right-4"
          variant="ghost"
          expandable="left"
        />

        {children}
      </div>
    </div>
  )
}

export default GameLayout
