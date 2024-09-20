"use client"

import { ZodType } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { FieldValues, useForm, UseFormProps, UseFormReturn } from "react-hook-form"

// shadcn
import { Form as ShadcnForm } from "@/components/ui/form"

type FormProps<FV extends FieldValues> = {
  schema: ZodType<FV>
  onSubmit: (form: UseFormReturn<FV>) => void
  className?: string
  children: (form: UseFormReturn<FV>) => React.ReactNode
} & UseFormProps<FV>

function Form<FV extends FieldValues> ({ schema, onSubmit, className, children, ...props }: FormProps<FV>) {
  const form = useForm<FV>({
    resolver: zodResolver(schema),
    ...props
  })

  return (
    <ShadcnForm {...form}>
      <form className={className}
        onSubmit={form.handleSubmit(() => onSubmit(form))}
      >
        {children(form)}
      </form>
    </ShadcnForm>
  )
}

export default Form
