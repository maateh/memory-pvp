type DashboardLayoutProps = {
  statistics: React.ReactNode
  rooms: React.ReactNode
  history: React.ReactNode
}

const DashboardLayout = ({ statistics, rooms, history }: DashboardLayoutProps) => {
  return (
    <div className="page-wrapper widget-container">
      {statistics}
      {rooms}
      {history}
    </div>
  )
}

export default DashboardLayout
