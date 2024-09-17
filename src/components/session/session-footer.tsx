// utils
import { cn } from "@/lib/utils"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionPlayer } from "@/components/session"

type SessionFooterProps = {
  session: GameSessionWithPlayerProfiles
}

const SessionFooter = ({ session }: SessionFooterProps) => {
  return (
    <div className={cn("w-full min-h-16 mx-auto py-3 px-3 flex flex-col items-center justify-center gap-x-6 bg-primary md:px-6 md:flex-row md:rounded-t-3xl md:max-w-screen-md lg:max-w-[896px]", {
      "sm:px-6 md:px-10": session.mode === 'SINGLE'
    })}>
      <SessionPlayer
        player={session.owner}
      />

      {session.mode !== 'SINGLE' && session.guest && (
        <>
          <Separator className="flex w-4/5 h-1 mx-auto my-4 bg-secondary-foreground/80 rounded-full md:hidden"
            orientation="vertical"
          />

          <Separator className="hidden w-1.5 h-14 bg-secondary-foreground/80 rounded-full md:flex"
            orientation="vertical"
          />

          <SessionPlayer
            player={session.guest}
            flipOrder
          />
        </>
      )}
    </div>
  )
}

export default SessionFooter