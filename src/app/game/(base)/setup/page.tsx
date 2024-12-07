// prisma
import type { GameMode, GameType, TableSize } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/user-action"
import { getPlayers } from "@/server/db/queries/player-query"
import { getRandomCollection } from "@/server/db/queries/collection-query"

// helpers
import { parseSchemaToClientCollection } from "@/lib/utils/parser/collection-parser"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerSelectButton } from "@/components/player/select"
import { UserManageButton } from "@/components/user"
import { SessionForm } from "@/components/session/form"

type BaseGameSetupPageProps = {
  searchParams: Partial<{
    type: GameType
    mode: GameMode
    tableSize: TableSize
    collection: string
  }>
}

const BaseGameSetupPage = async ({ searchParams }: BaseGameSetupPageProps) => {
  const user = await signedIn()
  const players = await getPlayers({ withAvatar: true })

  let clientCollection: ClientCardCollection | null = null
  if (searchParams.collection) {
    const collection = await db.cardCollection.findUnique({
      where: {
        id: searchParams.collection
      },
      include: {
        user: true,
        cards: true
      }
    })

    clientCollection = collection ? parseSchemaToClientCollection(collection) : null
  } else {
    clientCollection = await getRandomCollection(searchParams.tableSize)
  }

  return (
    <>
      <header className="text-center space-y-2">
        <h1 className="w-fit mx-auto text-3xl font-heading font-semibold heading-decorator sm:text-4xl">
          Let&apos;s memorize!
        </h1>

        <p className="text-muted-foreground text-xl font-heading sm:text-2xl">
          ...but first, <span className="text-accent">configure</span> your game session.
        </p>

        {user && (
          <PlayerSelectButton className="w-full max-w-56 px-2.5 border border-border/25 hover:bg-border/10 dark:hover:bg-border/10"
            avatarProps={{ className: "sm:size-7" }}
            players={players}
            showUserAvatar
          />
        )}

        {!user && (
          <UserManageButton className="mx-auto"
            showSignInIfLoggedOut
          />
        )}
      </header>

      <Separator className="w-2/5 bg-border/60 mx-auto my-5 sm:w-1/5 lg:w-1/6" />

      <main className="flex-1 flex flex-col">
        <SessionForm
          defaultValues={{ ...searchParams, collectionId: clientCollection?.id }}
          collection={clientCollection}
        />
      </main>
    </>
  )
}

export default BaseGameSetupPage
