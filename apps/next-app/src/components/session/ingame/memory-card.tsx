import Image from "next/image"

// types
import type { ClientSessionCard } from "@repo/schema/session"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Card, CardContent } from "@/components/ui/card"

type MemoryCardProps = {
  card: Pick<ClientSessionCard, 'matchedBy' | 'imageUrl'>
  isFlipped: boolean
  onClick: () => void
}

const MemoryCard = ({ card, isFlipped, onClick }: MemoryCardProps) => {
  return (
    <MemoryCardWrapper
      card={card}
      isFlipped={isFlipped}
      onClick={onClick}
    >
      <MemoryCardContentWrapper className="flex items-center justify-center bg-accent/45 dark:bg-accent/35 text-4xl font-bold">
        ?
      </MemoryCardContentWrapper>

      <MemoryCardContentWrapper className="img-wrapper">
        <Image
          src={card.imageUrl}
          alt="card image"
          height={256}
          width={256}
        />
      </MemoryCardContentWrapper>
    </MemoryCardWrapper>
  )
}

type MemoryCardWrapperProps = {
  children: React.ReactNode
} & MemoryCardProps

const MemoryCardWrapper = ({ card, isFlipped, onClick, children }: MemoryCardWrapperProps) => {
  return (
    <div className={cn("rounded-xl w-full max-w-40 mx-auto aspect-square cursor-pointer [perspective:1000px] transition-transform duration-300 ease-in-out", {
      "bg-secondary/25 shadow-lg shadow-secondary/65 hover:shadow-secondary/75": isFlipped,
      "hover:scale-105 hover:shadow-lg hover:shadow-border/40": !card.matchedBy,
      "scale-90 opacity-80 shadow-lg duration-1000": card.matchedBy
    })}
      onClick={onClick}
    >
      {isFlipped && (
        <div className="absolute inset-0 -z-10 rounded-3xl animate-pulse-glow">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-secondary/45 dark:from-secondary/25 to-secondary/95 dark:to-secondary/70 blur-xl animate-spin-slow" />
        </div>
      )}

      <div className={cn("relative size-full transition-transform duration-500 [transform-style:preserve-3d]", {
        "[transform:rotateY(180deg)]": isFlipped || card.matchedBy
      })}>
        {children}
      </div>
    </div>
  )
}

type MemoryCardContentWrapperProps = {
  className?: string
  children: React.ReactNode
}

const MemoryCardContentWrapper = ({ className, children }: MemoryCardContentWrapperProps) => {
  return (
    <Card className="rounded-2xl size-full absolute bg-transparent/0 [backface-visibility:hidden] last:[transform:rotateY(180deg)]">
      <CardContent className={cn("rounded-2xl p-0 size-full", className)}>
        {children}
      </CardContent>
    </Card>
  )
}

export default MemoryCard
