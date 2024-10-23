// components
import { PageHeading } from "@/components/shared"

type DashboardLayoutProps = {
  statistics: React.ReactNode
  rooms: React.ReactNode
  history: React.ReactNode
}

const DashboardLayout = ({ statistics, rooms, history }: DashboardLayoutProps) => {
  return (
    <>
      <PageHeading title="Dashboard" />

      <div className="page-wrapper widget-container">
        {statistics}
        {rooms}
        {history}
      </div>
    </>
  )
}

export default DashboardLayout
