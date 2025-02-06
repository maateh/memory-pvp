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
      <MemoryCardContentWrapper className="flex items-center justify-center bg-primary text-primary-foreground text-4xl font-bold">
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
    <div className={cn("rounded-xl w-full max-w-40 mx-auto aspect-square cursor-pointer [perspective:1000px] transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-border/40", {
      "shadow-lg shadow-secondary/65 hover:shadow-secondary/75": isFlipped,
      "shadow-lg shadow-border/60 hover:shadow-border/70": card.matchedBy
    })}
      onClick={onClick}
    >
      <div className={cn("relative size-full transition-transform duration-600 [transform-style:preserve-3d]", {
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
    <Card className="rounded-xl size-full absolute [backface-visibility:hidden] last:[transform:rotateY(180deg)]">
      <CardContent className={cn("rounded-xl p-0 size-full", className)}>
        {children}
      </CardContent>
    </Card>
  )
}

export default MemoryCard
