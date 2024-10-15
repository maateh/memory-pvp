// server
import { getClientSession } from "@/server/actions/session"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionStats } from "@/components/session"

type GameSessionSummaryProps = {
  params: {
    slug: string
  }
}

const GameSessionSummary = async ({ params }: GameSessionSummaryProps) => {
  const clientSession = await getClientSession({ slug: params.slug })

  if (!clientSession) {
    // TODO: show session not found or access denied layout
    return null
  }

  return (
    <main className="flex-1 px-2.5 sm:px-4">
      <header className="mt-24 mb-12">
        <h1 className="mt-24 pt-1.5 w-fit mx-auto text-3xl font-heading font-bold small-caps heading-decorator sm:text-5xl">
          Session Results
        </h1>

        <Separator className="w-5/6 mx-auto my-3 border-foreground/50" />
      </header>

      <SessionStats session={clientSession} />
    </main>
  )
}

export default GameSessionSummary
