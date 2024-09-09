// types
import { GameSessionClient } from "@/hooks/use-game-store"

// components
import { SessionPreparer } from "@/components/game"

type TablePlaygroundProps = {
  session: GameSessionClient
}

const TablePlayground = ({ session }: TablePlaygroundProps) => {
  return (
    <SessionPreparer session={session}>
      TablePlayground
    </SessionPreparer>
  )
}

export default TablePlayground
