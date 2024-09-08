// types
import { UnsignedGameSessionClient } from "@/hooks/use-game-store"

type TablePlaygroundProps = {
  session: UnsignedGameSessionClient
}

const TablePlayground = ({ session }: TablePlaygroundProps) => {
  return (
    <div className="flex-1 w-full flex justify-center items-center">
      TablePlayground
    </div>
  )
}

export default TablePlayground
