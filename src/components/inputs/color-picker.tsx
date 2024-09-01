import { forwardRef } from "react"

import { HexColorPicker } from "react-colorful"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ColorPickerProps = {
  value: string
  onChange: (value: string) => void
} & Omit<ButtonProps, 'value' | 'onChange'>

const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(({
  value,
  onChange,
  className,
  style = { backgroundColor: value },
  ...props
}, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn("size-8 rounded-lg border-2 border-border disabled:opacity-100", className)}
          size="icon"
          style={{ backgroundColor: value }}
          ref={ref}
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent>
        <HexColorPicker
          color={value}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  )
})
ColorPicker.displayName = "ColorPicker"

export default ColorPicker
