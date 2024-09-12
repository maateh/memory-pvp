type ProfileLayoutProps = {
  account: React.ReactNode
  players: React.ReactNode
}

const ProfileLayout = ({ account, players }: ProfileLayoutProps) => {
  return (
    <div className="m-4 mb-8 grid gap-x-12 gap-y-16 xl:grid-cols-2 xl:mx-4">
      {account}
      {players}
    </div>
  )
}

export default ProfileLayout
