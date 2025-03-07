// prisma
import type { GameMode, GameType, TableSize } from "@repo/db"
import type { ClientCardCollection } from "@/lib/schema/collection-schema"

// server
import { db } from "@repo/server/db"
import { signedIn } from "@/server/action/user-action"
import { getPlayers } from "@/server/db/query/player-query"
import { getRandomCollection } from "@/server/db/query/collection-query"

// helpers
import { parseSchemaToClientCollection } from "@/lib/util/parser/collection-parser"

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
    collectionId: string
  }>
}

const BaseGameSetupPage = async ({ searchParams }: BaseGameSetupPageProps) => {
  const user = await signedIn()
  const players = await getPlayers({ withAvatar: true })

  let clientCollection: ClientCardCollection | null = null
  if (searchParams.collectionId) {
    const collection = await db.cardCollection.findUnique({
      where: {
        id: searchParams.collectionId
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
          defaultValues={{ settings: searchParams }}
          collection={clientCollection}
        />
      </main>
    </>
  )
}

export default BaseGameSetupPage
