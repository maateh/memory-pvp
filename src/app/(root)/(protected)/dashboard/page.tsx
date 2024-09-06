// components
import GameSessionsWidget from "@/components/widgets/game-sessions"

const DashboardPage = () => {
  // TODO: dashboard WIDGETS
  // - player statistics
  // - previous game sessions
  // - friends

  return (
    <div className="m-4 mb-8 xl:mx-4">
      {/* TODO: dashboard header */}

      <div className="grid gap-x-12 gap-y-16 xl:grid-cols-2">
        <GameSessionsWidget />
      </div>
    </div>
  )
}

export default DashboardPage
