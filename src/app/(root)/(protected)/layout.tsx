// components
import { SignedIn } from "@/components/shared"

type ProtectedLayoutProps = {
  widget: React.ReactNode
  children: React.ReactNode
}

const ProtectedLayout = ({ widget, children }: ProtectedLayoutProps) => {
  return (
    <SignedIn>
      {widget}
      {children}
    </SignedIn>
  )
}

export default ProtectedLayout
