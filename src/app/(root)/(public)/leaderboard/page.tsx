// icons
import { Wrench } from "lucide-react"

// components
import { NoListingData } from "@/components/shared"

const LeaderboardPage = () => {
  // - by gamemode
  // - by table size

  // - sort by time per sessions
  // - sort by total score

  return (
    <NoListingData className="mt-44"
      Icon={Wrench}
      message="Leaderboard has not been implemented yet."
      hideClearFilter
    />
  )
}

export default LeaderboardPage
