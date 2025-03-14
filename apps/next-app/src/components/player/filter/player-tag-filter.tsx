"use client"

import { useState } from "react"

// schemas
import { playerFilter } from "@repo/schema/player"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// hooks
import { useDebounce } from "@/hooks/use-debounce"
import { useFilterParams } from "@/hooks/use-filter-params"

type PlayerTagFilterProps = {
  inputProps?: Omit<React.ComponentProps<typeof Input>, "type" | "placeholder" | "value" | "onChange">
} & React.ComponentProps<typeof Label>

const PlayerTagFilter = ({ inputProps, className, ...props }: PlayerTagFilterProps) => {
  const { filter, toggleFilterParam, removeFilterParam } = useFilterParams({
    filterSchema: playerFilter
  })

  const [playerTag, setPlayerTag] = useState<string>(filter.tag || "")

  useDebounce({
    value: playerTag,
    onDebounce(debouncedValue) {
      if (debouncedValue) toggleFilterParam("tag", debouncedValue)
      else removeFilterParam("tag")        
    }
  })


  return (
    <Label className={cn("text-base", className)} {...props}>
      <div className="mb-0.5 flex items-center gap-x-2">
        <Separator className="w-1.5 h-5 bg-accent rounded-full" />

        <p className="mt-1 text-base font-heading tracking-wide sm:text-lg">
          Player tag
        </p>
      </div>

      <Input {...inputProps}
        className={cn("h-9 border-border/40 rounded-xl font-light", inputProps?.className)}
        type="text"
        placeholder="Search..."
        value={playerTag}
        onChange={(e) => setPlayerTag(e.target.value)}
      />
    </Label>
  )
}

export default PlayerTagFilter
