// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// shadcn
import { Separator } from "@/components/ui/separator"
import { SessionStats } from "@/components/session"

type GameSessionSummaryProps = {
  params: {
    slug: string
  }
}

const GameSessionSummary = async ({ params }: GameSessionSummaryProps) => {
  // TODO: fetch session
  const session = null
  if (!session) return

  return (
    <main className="flex-1 px-2.5 sm:px-4">
      <header className="mt-24 mb-12">
        <h1 className="mt-24 pt-1.5 w-fit mx-auto text-3xl font-heading font-bold small-caps heading-decorator sm:text-5xl">
          Session Results
        </h1>

        <Separator className="w-5/6 mx-auto my-3 border-foreground/50" />
      </header>

      <SessionStats session={session} />
    </main>
  )
}

export default GameSessionSummary
