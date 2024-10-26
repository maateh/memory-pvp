// types
import type { UseFormReturn } from "react-hook-form"
import type { SessionFormValues } from "./session-form"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// shadcn
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

// components
import SessionInfoSelect from "./session-info-select"

const SessionFormFields = ({ control }: UseFormReturn<SessionFormValues>) => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
        <FormField
          name="type"
          control={control}
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
          control={control}
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
        control={control}
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

      {/* TODO: add collection selector */}
    </>
  )
}

export default SessionFormFields
