// types
import type { SessionFilter } from "@repo/schema/session"

// schemas
import { sessionFilter } from "@repo/schema/session"

// db
import { getPlayers } from "@/server/db/query/player-query"
import { getCollection, getRandomCollection } from "@/server/db/query/collection-query"

// actions
import { signedIn } from "@/server/action/user-action"

// utils
import { parseSearchParams } from "@/lib/util/parser/search-parser"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerSelectButton } from "@/components/player/select"
import { SessionForm } from "@/components/session/form"
import { UserManageButton } from "@/components/user"

type BaseGameSetupPageProps = {
  searchParams: Pick<SessionFilter, "mode" | "format" | "tableSize" | "collectionId">
}

const BaseGameSetupPage = async ({ searchParams }: BaseGameSetupPageProps) => {
  const searchEntries = new URLSearchParams(searchParams as {}).entries()
  const { filter } = parseSearchParams(searchEntries, {
    filterSchema: sessionFilter.pick({
      mode: true,
      format: true,
      tableSize: true,
      collectionId: true
    })
  })

  const { tableSize, collectionId } = filter
  
  const [user, players, collection] = await Promise.all([
    signedIn(),
    getPlayers({ withAvatar: true }),
    collectionId ? getCollection({ id: collectionId }) : getRandomCollection(tableSize)
  ])

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
          defaultValues={{ settings: filter }}
          collection={collection}
        />
      </main>
    </>
  )
}

export default BaseGameSetupPage
