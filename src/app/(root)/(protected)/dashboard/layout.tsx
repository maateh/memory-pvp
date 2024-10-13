type DashboardLayoutProps = {
  sessions: React.ReactNode
}

const DashboardLayout = ({ sessions }: DashboardLayoutProps) => {
  // TODO: dashboard WIDGETS
  // - player statistics
  // - previous game sessions
  // - friends

  return (
    <div className="page-wrapper widget-container">
      {sessions}
    </div>
  )
}

export default DashboardLayout
