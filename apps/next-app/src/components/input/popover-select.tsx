// utils
import { cn } from "@/lib/util"

// icons
import { ChevronsUpDown } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

// components
import { CommandSelect } from "@/components/input"

type PopoverSelectProps = {
  commandProps?: Omit<React.ComponentProps<typeof CommandSelect>, "heading" | "options" | "selectedValue" | "onValueChange">
} & Pick<React.ComponentProps<typeof CommandSelect>, "heading" | "options" | "selectedValue" | "onValueChange">
  & React.ComponentProps<typeof Button>

const PopoverSelect = ({
  className,
  commandProps,
  heading,
  options,
  selectedValue,
  onValueChange,
  children,
  ...props
}: PopoverSelectProps) => {
  const selected = options.find(({ value }) => value === selectedValue)
  const SelectedIcon = selected?.Icon

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn("px-4 flex items-center gap-x-2.5 rounded-2xl font-heading border border-border/35", className)}
          variant="ghost"
          size="lg"
          {...props}
        >
          {children || (
            <>
              {SelectedIcon && (
                <SelectedIcon className="size-5 shrink-0" strokeWidth={1.85} />
              )}

              <span className="mt-1 mr-2 tracking-wide sm:mt-1">
                {selected ? selected.label : "Search..."}
              </span>

              <ChevronsUpDown className="size-4 shrink-0 ml-auto text-muted-foreground/80" />
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-2 pt-1.5 pb-1">
        <CommandSelect
          heading={heading}
          options={options}
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          {...commandProps}
        />
      </PopoverContent>
    </Popover>
  )
}
export default PopoverSelect