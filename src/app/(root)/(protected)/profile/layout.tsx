type ProfileLayoutProps = {
  account: React.ReactNode
}

const ProfileLayout = ({ account }: ProfileLayoutProps) => {
  return (
    <div className="page-wrapper widget-container">
      {account}
    </div>
  )
}

export default ProfileLayout
