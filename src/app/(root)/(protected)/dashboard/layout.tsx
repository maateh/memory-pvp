// components
import { PageHeading } from "@/components/shared"

type DashboardLayoutProps = {
  history: React.ReactNode
}

const DashboardLayout = ({ history }: DashboardLayoutProps) => {
  // TODO: dashboard WIDGETS
  // - player statistics
  // - active multiplayer sessions

  return (
    <>
      <PageHeading heading="Dashboard" />

      <div className="page-wrapper widget-container">
        {history}
      </div>
    </>
  )
}

export default DashboardLayout
