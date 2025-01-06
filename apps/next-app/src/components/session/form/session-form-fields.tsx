// types
import type { UseFormReturn } from "react-hook-form"
import type { CreateSessionValidation } from "@/lib/schema/validation/session-validation"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/config/game-settings"

// shadcn
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

// components
import SessionInfoSelect from "./session-info-select"

type SessionFormFieldsProps = {
  form: UseFormReturn<CreateSessionValidation>
}

const SessionFormFields = ({ form }: SessionFormFieldsProps) => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1 max-w-xs">
              <FormLabel className="relative -inset-y-0.5 inset-x-2 text-lg font-heading font-medium dark:font-normal tracking-wider small-caps sm:text-xl">
                Session type
              </FormLabel>

              <FormControl>
                <SessionInfoSelect
                  LabelIcon={gameTypePlaceholders[field.value].Icon}
                  label={gameTypePlaceholders[field.value].label}
                  options={
                    Object.values(gameTypePlaceholders).map(({ key, label, Icon }) => ({
                      value: key,
                      label,
                      Icon
                    }))
                  }
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="mode"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1 max-w-xs">
              <FormLabel className="relative -inset-y-0.5 inset-x-2 text-lg font-heading font-medium dark:font-normal tracking-wider small-caps sm:text-xl">
                Session mode
              </FormLabel>
              
              <FormControl>
                <SessionInfoSelect
                  LabelIcon={gameModePlaceholders[field.value].Icon}
                  label={gameModePlaceholders[field.value].label}
                  options={
                    Object.values(gameModePlaceholders).map(({ key, label, Icon }) => ({
                      value: key,
                      label,
                      Icon
                    }))
                  }
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="tableSize"
        control={form.control}
        render={({ field }) => (
          <FormItem className="w-full max-w-sm mx-auto">
            <FormLabel className="relative -inset-y-0.5 inset-x-2 text-lg font-heading font-medium dark:font-normal tracking-wider small-caps sm:text-xl">
              Table size
            </FormLabel>
            
            <FormControl>
              <SessionInfoSelect
                LabelIcon={tableSizePlaceholders[field.value].Icon}
                label={tableSizePlaceholders[field.value].label}
                options={
                  Object.values(tableSizePlaceholders).map(({ key, label, Icon }) => ({
                    value: key,
                    label,
                    Icon
                  }))
                }
                value={field.value}
                onValueChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}

export default SessionFormFields
