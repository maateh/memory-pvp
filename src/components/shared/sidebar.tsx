// clerk
import { SignedIn, UserButton } from "@clerk/nextjs"

// components
import ThemeToggle from "@/components/shared/theme-toggle"

const Sidebar = () => {
  return (
    <aside className="h-screen w-full flex flex-col justify-between bg-neutral-200">
      <div>asd</div>
      
      <SignedIn>
        <div className="flex items-center justify-between">
          <UserButton />

          <ThemeToggle />
        </div>
      </SignedIn>
    </aside>
  )
}

export default Sidebar
