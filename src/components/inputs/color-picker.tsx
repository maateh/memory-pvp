import { forwardRef } from "react"

import { HexColorPicker } from "react-colorful"

// shadcn
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ColorPickerProps = {
  value: string
  onChange: (value: string) => void
}

const DEFAULT_COLOR_VALUE = "#e3e3e3"

const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(({
  value = DEFAULT_COLOR_VALUE,
  onChange
}, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="size-8 rounded-lg border-2 border-border"
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
