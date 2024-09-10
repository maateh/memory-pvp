// trpc
import { api } from "@/trpc/server"

// icons
import { BadgeInfo, Users2 } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { PlayerProfileForm } from "@/components/form"
import SelectPlayerProfile from "./select-player-profile"

const GameOfflineSavePage = async () => {
  const players = await api.playerProfile.getAll()

  return (
    <div className="flex-1 space-y-16">
      <section className="mt-24 space-y-3">
        <h1 className="w-fit mx-auto text-3xl font-heading font-bold small-caps heading-decorator sm:text-5xl">
          Game over!
        </h1>

        <Separator className="w-5/6 mx-auto border-foreground/50" />

        <h2 className="w-5/6 max-w-lg mx-auto text-sm text-center font-light font-heading sm:text-base sm:font-normal sm:w-fit">
          Now that you&apos;re logged in, please select a player profile where you would like to save the results of your offline session.
        </h2>
      </section>

      {/* TODO: show results here */}

      <section className="w-11/12 max-w-md mx-auto space-y-2 sm:w-fit">
        <PlayerProfileForm />

        <div className="flex items-center gap-x-2">
          <BadgeInfo className="size-4 shrink-0 sm:size-5" />
          <p className="text-xs font-extralight sm:text-sm">
            If you want, you can create a new profile to save your results.
          </p>
        </div>
      </section>

      <section className="w-11/12 max-w-lg mx-auto sm:w-fit">
        <div className="flex items-center justify-center gap-x-2.5 sm:items-start">
          <Users2 className="size-4 shrink-0 sm:size-5" />
          <h2 className="text-base font-heading small-caps sm:text-lg">
            Select Player Profile
          </h2>
        </div>

        <Separator className="w-1/2 mx-auto my-4" />

        <SelectPlayerProfile players={players} />
      </section>
    </div>
  )
}

export default GameOfflineSavePage
