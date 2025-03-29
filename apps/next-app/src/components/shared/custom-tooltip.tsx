// shadcn
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type CustomTooltipProps = {
  tooltip: React.ReactNode
  tooltipProps?: Omit<React.ComponentProps<typeof TooltipContent>, 'children'>
  children: React.ReactNode
} & React.ComponentProps<typeof TooltipTrigger>

const CustomTooltip = ({ tooltip, tooltipProps, ...props }: CustomTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger {...props} />
        <TooltipContent {...tooltipProps}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CustomTooltip
