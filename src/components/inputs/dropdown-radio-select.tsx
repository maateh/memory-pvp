// types
import type { LucideIcon } from "lucide-react"

// icons
import { MousePointerClick } from "lucide-react"

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

type DropdownRadioSelectItem = {
  label: string
  value: string
  Icon?: LucideIcon
}

type DropdownRadioSelectProps = {
  label?: string
  LabelIcon?: LucideIcon
  options: DropdownRadioSelectItem[]
  value: string
  onValueChange: (value: string) => void
} & React.ComponentProps<typeof DropdownMenuTrigger>

const DropdownRadioSelect = ({
  label = "Select value",
  LabelIcon = MousePointerClick,
  options, value, onValueChange,
  ...props
}: DropdownRadioSelectProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props} asChild />

      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center justify-between gap-x-8">
          <div className="flex items-center gap-x-2">
            <Separator className="h-4 w-1 rounded-full bg-border/50"
              orientation="vertical"
            />

            <p className="pt-1 text-base font-normal font-heading tracking-wider">
              {label}
            </p>
          </div>

          <LabelIcon className="size-[1.125rem]" strokeWidth={1.5} />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup
          value={value}
          onValueChange={onValueChange}
        >
          {options.map(({ label, value, Icon }) => (
            <DropdownMenuRadioItem className="text-accent"
              variant="muted"
              value={value}
              key={value}
            >
              {Icon && <Icon className="size-4" />}
              <span className="mt-0.5">
                {label}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownRadioSelect
export type { DropdownRadioSelectItem, DropdownRadioSelectProps }
