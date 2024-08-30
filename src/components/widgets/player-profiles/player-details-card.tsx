// icons
import { Edit, Star, Trash2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { ColorPicker } from "@/components/inputs"

type PlayerDetailsProps = {
  player: PlayerWithProfile
}

const PlayerDetails = ({ player }: PlayerDetailsProps) => {
  return (
    <div className="py-2.5 px-3 flex justify-between items-center rounded-lg hover:bg-transparent/5 dark:hover:bg-transparent/20">
      <div className="flex gap-x-4 items-center">
        <ColorPicker className="size-4 border"
          value={player.color}
          onChange={() => {}}
        />

        <div className="leading-snug">
          <p className="font-light">
            {player.tag}
          </p>

          <div className="flex items-center gap-x-1.5 text-sm font-extralight small-caps">
            <Star className="size-3.5" />
            <span>Total score - {player.totalScore} points</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        <Button className="p-1.5"
          variant="ghost"
          size="icon"
          onClick={() => {}}
        >
          <Edit className="size-5" />
        </Button>

        <Button className="p-1.5"
          variant="destructive"
          size="icon"
          onClick={() => {}}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default PlayerDetails
