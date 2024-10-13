type DashboardLayoutProps = {
  sessions: React.ReactNode
  children: React.ReactNode
}

const DashboardLayout = ({ sessions, children }: DashboardLayoutProps) => {
  // TODO: dashboard WIDGETS
  // - player statistics
  // - previous game sessions
  // - friends

  return (
    <div className="page-wrapper">
      {children}

      <div className="widget-container">
        {sessions}
      </div>
    </div>
  )
}

export default DashboardLayout
