import Image from "next/image"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Card, CardContent } from "@/components/ui/card"

type MemoryCardProps = {
  card: MemoryCard
  onClick: () => void
}

const MemoryCard = ({ card, onClick }: MemoryCardProps) => {
  return (
    <div className="w-full max-w-40 mx-auto aspect-square cursor-pointer [perspective:1000px] transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
      onClick={onClick}
    >
      <div className={cn("relative size-full transition-transform duration-600 [transform-style:preserve-3d]", {
        "[transform:rotateY(180deg)]": card.isFlipped
      })}>
        <Card className="size-full absolute [backface-visibility:hidden]">
          <CardContent className="p-0 size-full flex items-center justify-center bg-primary text-primary-foreground text-4xl font-bold">
            ?
          </CardContent>
        </Card>
        <Card className="size-full absolute [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardContent className="p-0 size-full img-wrapper">
            <Image
              src={card.imageUrl}
              alt="card image"
              fill
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MemoryCard
