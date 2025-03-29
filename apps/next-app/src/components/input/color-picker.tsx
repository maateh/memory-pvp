import { HexColorPicker } from "react-colorful"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ColorPickerProps = {
  value: string
  onChange: (value: string) => void
} & Omit<React.ComponentProps<typeof Button>, 'value' | 'onChange'>

const ColorPicker = (
  {
    ref,
    value,
    onChange,
    className,
    tooltip = "Select color",
    variant = "ghost",
    size = "icon",
    children,
    ...props
  }: ColorPickerProps & {
    ref: React.RefObject<HTMLButtonElement>;
  }
) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button className={cn({ "size-6": !children }, className)}
          tooltip={tooltip}
          variant={variant}
          size={size}
          style={!children ? { backgroundColor: value } : undefined}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-100">
        <HexColorPicker
          color={value}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}
ColorPicker.displayName = "ColorPicker"

export default ColorPicker
