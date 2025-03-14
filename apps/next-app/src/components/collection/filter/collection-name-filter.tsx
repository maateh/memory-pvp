"use client"

import { useState } from "react"

// schemas
import { collectionFilter } from "@repo/schema/collection"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// hooks
import { useDebounce } from "@/hooks/use-debounce"
import { useSearch } from "@/hooks/use-search"

type CollectionNameFilterProps = {
  inputProps?: Omit<React.ComponentProps<typeof Input>, "type" | "placeholder" | "value" | "onChange">
} & React.ComponentProps<typeof Label>

const CollectionNameFilter = ({ inputProps, className, ...props }: CollectionNameFilterProps) => {
  const { filter, toggleFilterParam, removeSearchParam: removeFilterParam } = useSearch({
    filterSchema: collectionFilter
  })

  const [collectionName, setCollectionName] = useState<string>(filter.name || "")

  useDebounce({
    value: collectionName,
    onDebounce(debouncedValue) {
      if (debouncedValue) toggleFilterParam("name", debouncedValue)
      else removeFilterParam("name")        
    }
  })

  return (
    <Label className={cn("text-base", className)} {...props}>
      <div className="mb-0.5 flex items-center gap-x-2">
        <Separator className="w-1.5 h-5 bg-accent rounded-full" />

        <p className="mt-1 font-heading tracking-wide">
          Collection name
        </p>
      </div>

      <Input {...inputProps}
        className={cn("h-9 border-border/40 rounded-xl font-light", inputProps?.className)}
        type="text"
        placeholder="Search..."
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
      />
    </Label>
  )
}

export default CollectionNameFilter
