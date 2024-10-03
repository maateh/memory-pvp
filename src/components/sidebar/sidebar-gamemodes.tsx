import Link from "next/link"

// constants
import { gameTypePlaceholders } from "@/constants/game"

// shadcn
import { buttonVariants } from "@/components/ui/button"

const SidebarGamemodes = () => {
  return (
    <div className="space-y-1.5">
      <h2 className="text-xl font-heading font-bold small-caps">
        Start New Game
      </h2>

      <div className="flex flex-wrap gap-2">
        {Object.values(gameTypePlaceholders).map(({ key, label, Icon }) => (
          <Link className={buttonVariants({
            className: "w-full flex-1 px-2.5 py-2 flex items-center justify-center gap-x-2 border-2 border-background/85 last-of-type:odd:col-span-2",
            variant: "ghost",
            size: "icon"
          })}
            href={`/game/setup?type=${key}`}
            key={key}
          >
            <Icon className="size-[1.125rem] shrink-0" />
            <p className="text-base small-caps">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SidebarGamemodes
