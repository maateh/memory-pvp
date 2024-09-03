// components
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { SignedIn } from "@/components/shared"

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="min-h-screen flex">
      <div className="z-50 hidden h-full w-72 fixed inset-y-0 md:flex lg:w-80">
        <Sidebar />
      </div>

      <div className="h-full w-full md:ml-72 lg:ml-80">
        <SignedIn>
          <div className="w-full">
            <Navbar />
          </div>
        </SignedIn>

        <div className="px-8 py-5">
          {children}
        </div>
      </div>
    </main>
  )
}

export default RootLayout
