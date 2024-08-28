"use client"

import { ZodType } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { FieldValues, SubmitHandler, useForm, UseFormProps, UseFormReturn } from "react-hook-form"

// shadcn
import { Form as ShadcnForm } from "@/components/ui/form"

type FormProps<FV extends FieldValues> = {
  schema: ZodType<FV>
  onSubmit: SubmitHandler<FV>
  children: (form: UseFormReturn<FV>) => React.ReactNode
} & UseFormProps<FV>

function Form<FV extends FieldValues> ({ schema, onSubmit, children, ...props }: FormProps<FV>) {
  const form = useForm<FV>({
    resolver: zodResolver(schema),
    ...props
  })

  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children(form)}
      </form>
    </ShadcnForm>
  )
}

export default Form
