// types
import type { ClientSessionCard } from "@repo/schema/session"

// utils
import { cn } from "@/lib/util"

// components
import MemoryCard from "./memory-card"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

type MemoryTableProps = {
  handleCardFlip: (clickedCard: ClientSessionCard) => void
}

const MemoryTable = ({ handleCardFlip }: MemoryTableProps) => {
  const session = useSessionStore((state) => state.session)

  return (
    <main className="flex-1 w-full p-4 flex justify-center items-center">
      <div className={cn("grid gap-4 w-full grid-cols-3", {
        "max-w-3xl md:grid-cols-4": session.tableSize === "SMALL",
        "max-w-5xl sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6": session.tableSize === "MEDIUM",
        "max-w-7xl sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8": session.tableSize === "LARGE"
      }
      )}>
        {session.cards.map((card) => (
          <MemoryCard
            card={card}
            isFlipped={session.flipped.some(({ key }) => card.key === key)}
            onClick={() => handleCardFlip(card)}
            key={card.key}
          />
        ))}
      </div>
    </main>
  )
}

export default MemoryTable
