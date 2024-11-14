type DashboardLayoutProps = {
  statistics: React.ReactNode
  players: React.ReactNode
  rooms: React.ReactNode
  history: React.ReactNode
}

const DashboardLayout = ({ statistics, players, rooms, history }: DashboardLayoutProps) => {
  return (
    <div className="page-wrapper widget-container">
      {statistics}
      {players}
      {rooms}
      {history}
    </div>
  )
}

export default DashboardLayout
