// types
import type { UseFormReturn } from "react-hook-form"
import type { SessionFormValues } from "./session-form"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// icons
import { Images } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

// components
import { CollectionCard } from "@/components/collection"
import SessionInfoSelect from "./session-info-select"

type SessionFormFieldsProps = {
  form: UseFormReturn<SessionFormValues>
  randomCollection: ClientCardCollection | null
}

const SessionFormFields = ({ form, randomCollection }: SessionFormFieldsProps) => {
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

      <FormField
        name="collectionId"
        control={form.control}
        render={({ field }) => (
          <FormItem className="w-full max-w-2xl m-auto lg:w-2/5">
            <div className="flex flex-wrap-reverse justify-between items-center gap-x-6 gap-y-2">
              <FormLabel className="relative -inset-y-0.5 inset-x-2 text-lg font-heading font-semibold tracking-wider heading-decorator sm:text-2xl">
                Card collection
              </FormLabel>

              <Button className="mb-2.5 ml-auto p-2.5 gap-x-2 text-muted-foreground border-2 border-border/20 rounded-2xl expandable expandable-left"
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => {}} // TODO: add collection selector modal
              >
                <div>
                  <span className="font-normal dark:font-light">
                    Select collection...
                  </span>
                </div>
                <Images className="size-4" strokeWidth={2.5} />
              </Button>
            </div>
            
            {randomCollection && (
              <CollectionCard className="h-fit w-full bg-background/50"
                collection={randomCollection}
                imageSize={26}
                withoutGameLink
              />
            )}
          </FormItem>
        )}
      />
    </>
  )
}

export default SessionFormFields
