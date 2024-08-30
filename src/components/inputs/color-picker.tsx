import { forwardRef } from "react"

import { HexColorPicker } from "react-colorful"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ColorPickerProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(({
  value,
  onChange,
  className
}, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn("size-8 rounded-lg border-2 border-border", className)}
          size="icon"
          style={{ backgroundColor: value }}
          ref={ref}
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
