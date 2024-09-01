// shadnc
import { Tooltip, TooltipContent, TooltipContentProps, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipTriggerProps } from "@radix-ui/react-tooltip"

type CustomTooltipProps = {
  tooltip: React.ReactNode
  tooltipProps?: Omit<TooltipContentProps, 'children'>
} & TooltipTriggerProps & React.PropsWithChildren

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
