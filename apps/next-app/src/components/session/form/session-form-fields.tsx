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

// utils
import { cn } from "@/lib/util"

// shadcn
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

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
      <FormField
        name="settings.format"
        control={form.control}
        render={({ field }) => (
          <FormItem className="w-2/5 mx-auto">
            <FormLabel className="relative -inset-y-0.5 inset-x-2 text-lg font-heading font-medium dark:font-normal tracking-wider small-caps sm:text-xl">
              Match format
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

      <Separator className="w-2/5 mx-auto -my-1 bg-border/10" />

      <FormField
        name="settings.mode"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ButtonGroup className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
                value={field.value}
                onValueChange={(mode) => {
                  field.onChange(mode)
                  addSearchParam("mode", mode)
                }}
              >
                {Object.values(sessionModePlaceholders).map(({ key, label, Icon }) => (
                  <ButtonGroupItem className={cn("flex-1 min-w-32 max-w-52 rounded-2xl text-foreground/80 font-normal hover:scale-[1.025]", {
                    "text-foreground font-semibold": field.value === key
                  })}
                    size="lg"
                    type="button"
                    value={key}
                    key={key}
                  >
                    <Icon className="size-5 shrink-0" strokeWidth={1.85} />

                    <span className="mt-1 text-base font-heading">
                      {label}
                    </span>
                  </ButtonGroupItem>
                ))}
              </ButtonGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="settings.tableSize"
        control={form.control}
        render={({ field }) => (
          <FormItem>           
            <FormControl>
              <ButtonGroup className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
                value={field.value}
                onValueChange={(tableSize) => {
                  field.onChange(tableSize)
                  addSearchParam("tableSize", tableSize)
                }}
              >
                {Object.values(tableSizePlaceholders).map(({ key, label, size, Icon }) => (
                  <ButtonGroupItem className={cn("w-24 flex-col rounded-3xl text-foreground/80 font-normal hover:scale-[1.025] data-[state=checked]:bg-muted-foreground/20", {
                    "text-foreground font-semibold": field.value === key
                  })}
                    indicatorProps={{ className: "top-2 right-2" }}
                    size="icon"
                    type="button"
                    value={key}
                    key={key}
                  >
                    <Icon className="size-5 shrink-0" strokeWidth={2.5} />

                    <div className="flex flex-col font-heading">
                      <span className="text-base">
                        {label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {size}
                      </span>
                    </div>
                  </ButtonGroupItem>
                ))}
              </ButtonGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}

export default SessionFormFields
