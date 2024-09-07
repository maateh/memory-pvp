// prisma
import { GameMode, GameType, TableSize } from "@prisma/client"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { ThemeToggle } from "@/components/shared"
import { StartGameForm } from "@/components/form"

type GameSetupPageProps = {
  searchParams: {
    type: GameType
    mode: GameMode
    tableSize: TableSize
  }
}

const GameSetupPage = ({ searchParams }: GameSetupPageProps) => {
  return (
    <div className="relative flex-1 pt-12 pb-8 px-4 flex flex-col gap-y-3 sm:pt-16">
      <ThemeToggle className="p-2 bg-accent/30 absolute top-2 right-2 sm:top-4 sm:right-4 sm:p-2"
        variant="ghost"
      />

      <div className="w-fit mx-auto text-center">
        <h1 className="w-fit mx-auto text-3xl font-heading font-semibold sm:heading-decorator sm:text-4xl max-sm:border-t-2 max-sm:border-t-accent max-sm:pt-2">
          Let&apos;s memorize!
        </h1>

        <p className="text-muted-foreground text-xl font-heading sm:text-2xl">
          ...but first, <span className="text-accent">configure</span> your game session.
        </p>
      </div>

      <Separator className="w-3/5 mx-auto my-5 sm:w-2/5 lg:w-1/5" />

      <StartGameForm defaultValues={searchParams} />
    </div>
  )
}

export default GameSetupPage
