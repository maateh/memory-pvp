// components
import { SignedIn } from "@clerk/nextjs"

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  )
}

export default ProtectedLayout
