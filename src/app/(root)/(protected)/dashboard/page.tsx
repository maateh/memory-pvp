// actions
import { currentProfile } from "@/lib/db/current-profile"

const DashboardPage = async () => {
  const profile = await currentProfile()

  // - show player statistics
  //  - player name
  //  - leaderboard rank
  // - show previous game sessions
  // - show friends

  return (
    <div>
      DashboardPage
    </div>
  )
}

export default DashboardPage
