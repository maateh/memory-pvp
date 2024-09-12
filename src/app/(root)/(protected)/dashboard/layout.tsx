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
    <div className="m-4 mb-8 xl:mx-4">
      {children}

      <div className="grid gap-x-12 gap-y-16 xl:grid-cols-2">
        {sessions}
      </div>
    </div>
  )
}

export default DashboardLayout
