// types
import type { FieldValues, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Form as ShadcnForm } from "@/components/ui/form"

type FormProps<FV extends FieldValues = FieldValues> = {
  form: UseFormReturn<FV>
  onSubmit: SubmitHandler<FV>
  onInvalid?: SubmitErrorHandler<FV>
} & Omit<React.ComponentProps<"form">, 'onSubmit'>

function Form<FV extends FieldValues = FieldValues>({ form, onSubmit, onInvalid, className, ...props }: FormProps<FV>) {
  return (
    <ShadcnForm {...form}>
      <form className={cn("grid gap-y-5", className)}
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        {...props}
      />
    </ShadcnForm>
  )
}

export default Form
