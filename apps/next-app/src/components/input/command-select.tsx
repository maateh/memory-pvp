// types
import type { LucideIcon } from "lucide-react"

// utils
import { cn } from "@/lib/util"

// icons
import { Check } from "lucide-react"

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"

// copmponents
import { CardItem } from "@/components/shared"

type SelectOption = {
  label: string
  value: string
  Icon?: LucideIcon
}

type CommandSelectProps = {
  itemProps?: Omit<React.ComponentProps<typeof CommandItem>, "value" | "onSelect" | "key">
  heading?: string
  options: SelectOption[]
  selectedValue: string
  onValueChange: (value: string) => void
} & React.ComponentProps<typeof Command>

const CommandSelect = ({
  itemProps,
  heading,
  options,
  selectedValue,
  onValueChange,
  ...props
}: CommandSelectProps) => {
  return (
    <Command {...props}>
      <CommandInput placeholder="Search..." />

      <CommandSeparator className="w-4/5 mx-auto mt-1.5 mb-0.5 bg-border/20" />

      <CommandList>
        <CommandEmpty className="mt-2 text-sm text-muted-foreground font-light">
          <CardItem className="py-2 justify-center">
            No data found.
          </CardItem>
        </CommandEmpty>

        <CommandGroup heading={heading}>
          {options.map(({ value, label, Icon }) => (
            <CommandItem {...itemProps}
              className={cn("my-0.5 cursor-pointer", {
                "text-foreground/85 bg-accent/40 data-[selected=true]:bg-accent/45": value === selectedValue
              }, itemProps?.className)}
              value={value}
              onSelect={onValueChange}
              key={value}
            >
              {Icon && (
                <Icon className="size-4 shrink-0"
                  strokeWidth={2.5}
                  key="selected_option_icon"
                />
              )}

              <span className="mt-0.5" key="selected_option_label">
                {label}
              </span>

              {value === selectedValue && (
                <Check className="shrink-0 ml-auto"
                  strokeWidth={3.5}
                  key="selected_icon"
                />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export default CommandSelect
