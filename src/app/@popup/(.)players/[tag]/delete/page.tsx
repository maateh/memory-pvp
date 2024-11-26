// components
import { PlayerDeletePopup } from "@/components/player/popup"

type PlayersDeletePopupPageProps = {
  params: {
    tag: string
  }
}

const PlayersDeletePopupPage = ({ params }: PlayersDeletePopupPageProps) => {
  return (
    <PlayerDeletePopup
      renderer="router"
      playerTag={params.tag}
    />
  )
}

export default PlayersDeletePopupPage
