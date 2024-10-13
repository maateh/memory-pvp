type ProfileLayoutProps = {
  account: React.ReactNode
  players: React.ReactNode
  children: React.ReactNode
}

const ProfileLayout = ({ account, players, children }: ProfileLayoutProps) => {
  return (
    <div className="page-wrapper">
      {children}

      <div className="widget-container">
        {account}
        {players}
      </div>
    </div>
  )
}

export default ProfileLayout
