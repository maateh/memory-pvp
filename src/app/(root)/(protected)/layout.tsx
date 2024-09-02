// clerk
import { SignedIn } from "@clerk/nextjs"

// components
import { Navbar } from "@/components/navbar"

const ProtectedLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <SignedIn>
        <div className="w-full">
          <Navbar />
        </div>
      </SignedIn>

      <div className="px-8 py-5">
        {children}
      </div>
    </>
  )
}

export default ProtectedLayout
