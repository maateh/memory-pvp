// types
import type { UseFormReturn } from "react-hook-form"
import type { PlayerProfileFormValues } from "./player-profile-form"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import { ColorPicker } from "@/components/inputs"

type PlayerProfileFormFieldsProps = {
  form: UseFormReturn<PlayerProfileFormValues>
}

const PlayerProfileFormFields = ({ form }: PlayerProfileFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="tag"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>
              Player Tag
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ColorPicker {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default PlayerProfileFormFields
