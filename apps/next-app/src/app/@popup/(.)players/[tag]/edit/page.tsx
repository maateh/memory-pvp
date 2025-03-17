// components
import { PlayerEditPopup } from "@/components/player/popup"

type PlayersEditPopupPageProps = {
  params: Promise<{
    tag: string
  }>
}

const PlayersEditPopupPage = async (props: PlayersEditPopupPageProps) => {
  const params = await props.params;
  return (
    <PlayerEditPopup
      renderer="router"
      playerTag={params.tag}
    />
  )
}

export default PlayersEditPopupPage
