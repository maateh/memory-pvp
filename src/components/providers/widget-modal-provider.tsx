// components (widget modals)
import PlayerProfilesWidgetModal from "@/components/widgets/player-profiles/modal"
import GameSessionsWidgetModal from "@/components/widgets/game-sessions/modal"

const WidgetModalProvider = () => {
  return (
    <>
      <PlayerProfilesWidgetModal />
      <GameSessionsWidgetModal />
    </>
  )
}

export default WidgetModalProvider
