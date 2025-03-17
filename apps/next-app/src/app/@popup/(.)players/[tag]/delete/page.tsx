// components
import { PlayerDeletePopup } from "@/components/player/popup"

type PlayersDeletePopupPageProps = {
  params: Promise<{
    tag: string
  }>
}

const PlayersDeletePopupPage = async (props: PlayersDeletePopupPageProps) => {
  const params = await props.params;
  return (
    <PlayerDeletePopup
      renderer="router"
      playerTag={params.tag}
    />
  )
}

export default PlayersDeletePopupPage
