// types
import type { UseFormReturn } from "react-hook-form"
import type { PlayerProfileFormValues } from "./player-profile-form"

// icons
import { Hash } from "lucide-react"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// components
import { ColorPicker } from "@/components/input"

type PlayerProfileFormFieldsProps = {
  form: UseFormReturn<PlayerProfileFormValues>
}

const PlayerProfileFormFields = ({ form }: PlayerProfileFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ColorPicker className="border border-border/15" {...field}>
                <Hash className="size-4"
                  style={{ color: field.value }}
                  strokeWidth={4}
                />
              </ColorPicker>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tag"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel className="-top-6 flex items-center gap-x-2">
              <Separator className="w-1 h-4 bg-accent rounded-full" />

              <p className="mt-1 font-heading tracking-wide">
                Player tag
              </p>
            </FormLabel>
            <FormControl>
              <Input className="h-9 border-border/35"
                placeholder="e.g. Jimmy"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default PlayerProfileFormFields
