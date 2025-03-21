// types
import type { UseFormReturn } from "react-hook-form"
import type { SessionFormValidation } from "@repo/schema/session-validation"

// schemas
import { sessionFormFilter } from "@repo/schema/session"


// config
import {
  matchFormatPlaceholders,
  sessionModePlaceholders,
  tableSizePlaceholders
} from "@repo/config/game"

// shadcn
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

// components
import SessionInfoSelect from "./session-info-select"

// hooks
import { useSearch } from "@/hooks/use-search"

type SessionFormFieldsProps = {
  form: UseFormReturn<SessionFormValidation>
}

const SessionFormFields = ({ form }: SessionFormFieldsProps) => {
  const { addSearchParam } = useSearch({ filterSchema: sessionFormFilter })

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
        <FormField
          name="settings.mode"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1 max-w-xs">
              <FormLabel className="relative -inset-y-0.5 inset-x-2 text-lg font-heading font-medium dark:font-normal tracking-wider small-caps sm:text-xl">
                Session type
              </FormLabel>

              <FormControl>
                <SessionInfoSelect
                  LabelIcon={sessionModePlaceholders[field.value].Icon}
                  label={sessionModePlaceholders[field.value].label}
                  options={
                    Object.values(sessionModePlaceholders).map(({ key, label, Icon }) => ({
                      value: key,
                      label,
                      Icon
                    }))
                  }
                  value={field.value}
                  onValueChange={(mode) => addSearchParam("mode", mode)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="settings.format"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1 max-w-xs">
              <FormLabel className="relative -inset-y-0.5 inset-x-2 text-lg font-heading font-medium dark:font-normal tracking-wider small-caps sm:text-xl">
                Session mode
              </FormLabel>
              
              <FormControl>
                <SessionInfoSelect
                  LabelIcon={matchFormatPlaceholders[field.value].Icon}
                  label={matchFormatPlaceholders[field.value].label}
                  options={
                    Object.values(matchFormatPlaceholders).map(({ key, label, Icon }) => ({
                      value: key,
                      label,
                      Icon
                    }))
                  }
                  value={field.value}
                  onValueChange={(format) => addSearchParam("format", format)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="settings.tableSize"
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
                onValueChange={(tableSize) => addSearchParam("tableSize", tableSize)}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}

export default SessionFormFields
