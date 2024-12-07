// types
import type { LucideIcon } from "lucide-react"
import type { DropdownRadioSelectProps } from "@/components/input/dropdown-radio-select"

// icons
import { MousePointerClick } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { DropdownRadioSelect } from "@/components/input"

type SessionInfoSelectProps = Pick<
  DropdownRadioSelectProps,
  'label' | 'options' | 'value' | 'onValueChange'
> & {
  LabelIcon: LucideIcon
  label: string
}

const SessionInfoSelect = ({ LabelIcon, label, options, value, onValueChange }: SessionInfoSelectProps) => {
  return (
    <DropdownRadioSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
    >
      <div className="flex items-center justify-center gap-x-2.5 sm:gap-x-4">
        <Button className="group flex-1 px-4 flex items-center gap-x-3 rounded-2xl text-base font-heading bg-secondary/10 hover:bg-secondary/20 dark:hover:bg-secondary/15 border border-border/25 transition-all drop-shadow-lg dark:drop-shadow-xl hover:drop-shadow-xl dark:hover:drop-shadow-2xl sm:text-lg sm:px-5"
          variant="ghost"
          size="lg"
        >
          <Separator className="h-5 w-1.5 bg-accent rounded-full"
            orientation="vertical"
          />

          <span className="mt-0.5 mr-2 tracking-wide sm:mt-1">
            {label}
          </span>

          <LabelIcon className="size-5 sm:size-6 ml-auto text-muted-foreground"
            strokeWidth={1.75}
          />
        </Button>

        <Button className="p-1.5 bg-secondary/10 dark:bg-secondary/5 border border-border/25 sm:p-2"
          type="button"
          variant="ghost"
          size="icon"
        >
          <MousePointerClick className="size-4 sm:size-5 text-muted-foreground"
            strokeWidth={2.25}
          />
        </Button>
      </div>
    </DropdownRadioSelect>
  )
}

export default SessionInfoSelect
