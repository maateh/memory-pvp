"use client"

// shadcn
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

// components
import { PlayerProfileForm } from "@/components/player/form"
import { PlayerSelectCommand } from "@/components/player/select"

// hooks
import { useSelectAsActiveMutation } from "@/lib/react-query/mutations/player"

type PlayerSelectDrawerProps = {
  players: ClientPlayer[]
} & React.ComponentProps<typeof DrawerTrigger>

const PlayerSelectDrawer = ({ players, ...props }: PlayerSelectDrawerProps) => {
  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

  return (
    <Drawer>
      <DrawerTrigger {...props} />

      <DrawerContent className="border-border/25">
        <DrawerHeader className="gap-y-0">
          <DrawerTitle className="mt-2 text-2xl font-heading heading-decorator">
            Select active player
          </DrawerTitle>

          <DrawerDescription className="text-start text-sm text-muted-foreground font-light">
            Player profiles makes it easier to use smurf accounts if you want.
          </DrawerDescription>
        </DrawerHeader>

        <Separator className="w-5/6 mx-auto mb-3 bg-border/15" />

        <PlayerSelectCommand className="w-full max-w-xl mx-auto px-4"
          listProps={{ className: "w-full max-w-lg mx-auto px-2" }}
          players={players}
          handleSelect={handleSelectAsActive}
          isPending={selectAsActive.isPending}
        />

        <Separator className="w-5/6 mx-auto my-3 bg-border/15" />

        <DrawerFooter className="w-full max-w-xl mx-auto px-4 gap-y-8">
          <h3 className="text-lg font-heading font-semibold small-caps heading-decorator subheading">
            Create new player profile
          </h3>

          <PlayerProfileForm />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PlayerSelectDrawer
