// utils
import { cn } from "@/lib/utils"

// types
import type { MemoryCard as TMemoryCard } from "@/hooks/store/use-session-store"

// components
import MemoryCard from "./memory-card"

type MemoryTableProps = {
  session: ClientGameSession
  handleCardFlip: (clickedCard: TMemoryCard) => void
}

const MemoryTable = ({ session, handleCardFlip }: MemoryTableProps) => {
  return (
    <div className="flex-1 w-full p-4 flex justify-center items-center">
      <div className={cn("grid gap-4 w-full grid-cols-3", {
        "max-w-3xl md:grid-cols-4": session.tableSize === 'SMALL',
        "max-w-5xl sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6": session.tableSize === 'MEDIUM',
        "max-w-7xl sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8": session.tableSize === 'LARGE'
      }
      )}>
        {session.cards.map((card) => (
          <MemoryCard
            card={card}
            onClick={() => handleCardFlip(card)}
            key={card.id}
          />
        ))}
      </div>
    </div>
  )
}

export default MemoryTable
