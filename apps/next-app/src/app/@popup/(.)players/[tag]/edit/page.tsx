// components
import { PlayerEditPopup } from "@/components/player/popup"

type PlayersEditPopupPageProps = {
  params: Promise<{
    tag: string
  }>
}

const PlayersEditPopupPage = async ({ params }: PlayersEditPopupPageProps) => {
  const { tag } = await params

  return (
    <PlayerEditPopup
      renderer="router"
      playerTag={tag}
    />
  )
}

export default PlayersEditPopupPage
