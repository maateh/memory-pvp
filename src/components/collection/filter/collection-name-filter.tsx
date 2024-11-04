"use client"

import { useEffect, useState } from "react"

// types
import { CollectionFilter } from "./types"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// hooks
import { useFilterParams } from "@/hooks/use-filter-params"
import { useDebounce } from "@/hooks/use-debounce"

type CollectionNameFilterProps = {
  inputProps?: Omit<React.ComponentProps<typeof Input>, 'type' | 'placeholder' | 'value' | 'onChange'>
} & React.ComponentProps<typeof Label>

const CollectionNameFilter = ({ inputProps, className, ...props }: CollectionNameFilterProps) => {
  const { filter, toggleFilterParam, removeFilterParam } = useFilterParams<CollectionFilter>()

  const [collectionName, setCollectionName] = useState<string>(filter.name || "")
  const debouncedValue = useDebounce({ value: collectionName })

  useEffect(() => {
    if (collectionName) {
      toggleFilterParam("name", collectionName)
    } else {
      removeFilterParam("name")
    }
  }, [collectionName, debouncedValue, toggleFilterParam, removeFilterParam])

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
