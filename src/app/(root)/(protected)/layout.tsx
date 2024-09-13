// components
import { SignedIn } from "@/components/shared"

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  )
}

export default ProtectedLayout
