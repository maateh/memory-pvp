// components
import { Navbar } from "@/components/shared"

const DashboardLayot = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <div className="w-full">
        <Navbar />
      </div>

      <div className="px-8 py-5">
        {children}
      </div>
    </>
  )
}

export default DashboardLayot
