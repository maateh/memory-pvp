// components
import { SignedIn } from "@/components/shared"

const ProtectedLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  )
}

export default ProtectedLayout
