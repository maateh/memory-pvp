import Link from "next/link"

// constants
import { gamemodes } from "@/constants/navigation"

// shadcn
import { buttonVariants } from "@/components/ui/button"

const SidebarGamemodes = () => {
  return (
    <div className="space-y-1.5">
      <h2 className="text-xl font-bold small-caps">
        Select a gamemode
      </h2>

      <div className="max-w-xl mx-auto grid grid-cols-2 gap-2">
        {gamemodes.map(({ key, label, query, Icon }) => (
          <Link className={buttonVariants({
            className: "px-2.5 py-1.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-2 rounded-xl last-of-type:col-span-2",
            variant: "outline",
            size: "icon"
          })}
            href={`/game/setup?${query}`}
            key={key}
          >
            <Icon className="size-5 shrink-0" />
            <p className="text-lg small-caps">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SidebarGamemodes
