// components
import { PageHeading } from "@/components/shared"

type ProfileLayoutProps = {
  account: React.ReactNode
  players: React.ReactNode
}

const ProfileLayout = ({ account, players }: ProfileLayoutProps) => {
  return (
    <>
      <PageHeading heading="Profile" />

      <div className="page-wrapper widget-container">
        {account}
        {players}
      </div>
    </>
  )
}

export default ProfileLayout
