// components
import { PlayerEditPopup } from "@/components/player/popup"

type PlayersEditPopupPageProps = {
  params: {
    tag: string
  }
}

const PlayersEditPopupPage = ({ params }: PlayersEditPopupPageProps) => {
  return (
    <PlayerEditPopup
      renderer="router"
      playerTag={params.tag}
    />
  )
}

export default PlayersEditPopupPage
