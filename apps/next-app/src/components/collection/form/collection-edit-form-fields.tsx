// types
import type { UseFormReturn } from "react-hook-form"
import type { UpdateCardCollectionValidation } from "@/lib/schema/validation/collection-validation"

// shadcn
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type CollectionEditFormFieldsProps = {
  form: UseFormReturn<UpdateCardCollectionValidation>
}

const CollectionEditFormFields = ({ form }: CollectionEditFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="w-full max-w-md mx-auto">
            <FormLabel className="font-normal">
              Collection Name
            </FormLabel>
            <FormControl>
              <Input className="border border-input/20"
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
            <FormLabel className="font-normal">
              Description
            </FormLabel>
            <FormControl>
              <Textarea className="font-extralight dark:font-thin border border-input/20 tracking-wide resize-none"
                minLength={8}
                maxLength={128}
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

export default CollectionEditFormFields
