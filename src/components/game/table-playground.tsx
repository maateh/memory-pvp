// types
import { UnsignedGameSessionClient } from "@/hooks/use-game-store"

type TablePlaygroundProps = {
  session: UnsignedGameSessionClient
}

const TablePlayground = ({ session }: TablePlaygroundProps) => {
  return (
    <div>
      TablePlayground
    </div>
  )
}

export default TablePlayground
