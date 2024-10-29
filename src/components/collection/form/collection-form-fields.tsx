"use client"

// types
import type { UseFormReturn } from "react-hook-form"
import type { ExpandedRouteConfig } from "uploadthing/types"
import type { CollectionFormValues } from "@/components/collection/form/collection-form"

// constants
import { tableSizePlaceholders } from "@/constants/game"

// icons
import { ImagePlus, Loader2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// components
import { CollectionDropzone } from "@/components/inputs"

type CollectionFormFieldsProps = {
  form: UseFormReturn<CollectionFormValues>
  routeConfig?: ExpandedRouteConfig
  isPending: boolean
  disabled?: boolean
}

const CollectionFormFields = ({ form, routeConfig, isPending, disabled }: CollectionFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="w-full max-w-md mx-auto">
            <FormLabel className="dark:font-light">
              Collection Name
            </FormLabel>
            <FormControl>
              <Input className="border border-input/40"
                minLength={4}
                maxLength={28}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="w-full max-w-md mx-auto mt-4 mb-2">
            <FormLabel className="dark:font-light">
              Description
            </FormLabel>
            <FormControl>
              <Textarea className="font-extralight dark:font-thin border border-input/40 tracking-wide resize-none"
                minLength={8}
                maxLength={128}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="tableSize"
        control={form.control}
        render={({ field }) => (
          <FormItem className="space-y-0.5">
            <FormControl>
              <ButtonGroup className="flex flex-wrap items-center justify-evenly gap-x-4 gap-y-1.5"
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                {Object.values(tableSizePlaceholders).map(({ key, label, Icon }) => (
                  <ButtonGroupItem className="w-full max-w-36 flex items-center gap-x-2 border border-border/25 rounded-2xl hover:bg-accent/40 dark:hover:bg-accent/40 data-[state=checked]:bg-accent/60"
                    size="icon"
                    variant="ghost"
                    type="button"
                    value={key}
                    key={key}
                  >
                    <Icon className="size-4 sm:size-[1.125rem] flex-none" />

                    <p className="-mt-0.5 text-base small-caps">
                      {label}
                    </p>
                  </ButtonGroupItem>
                ))}
              </ButtonGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="images"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <CollectionDropzone
                files={field.value}
                setFiles={field.onChange}
                routeConfig={routeConfig}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Button className="flex gap-x-2 rounded-2xl max-sm:mx-auto sm:ml-auto sm:text-base"
        variant="secondary"
        type="submit"
        disabled={disabled}
      >
        {isPending ? (
          <Loader2 className="size-4 sm:size-5 shrink-0 animate-spin" />
        ) : (
          <ImagePlus className="size-4 sm:size-5 shrink-0" />
        )}

        <span>Create collection</span>
      </Button>
    </>
  )
}

export default CollectionFormFields
