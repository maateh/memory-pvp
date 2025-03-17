// components
import { PlayerDeletePopup } from "@/components/player/popup"

type PlayersDeletePopupPageProps = {
  params: Promise<{
    tag: string
  }>
}

const PlayersDeletePopupPage = async ({ params }: PlayersDeletePopupPageProps) => {
  const { tag } = await params

  return (
    <PlayerDeletePopup
      renderer="router"
      playerTag={tag}
    />
  )
}

export default PlayersDeletePopupPage
