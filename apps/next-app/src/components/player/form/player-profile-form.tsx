"use client"

import { useForm } from "react-hook-form"

// types
import type { DefaultValues } from "react-hook-form"
import type { CreatePlayerValidation } from "@/lib/schema/validation/player-validation"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { createPlayerValidation } from "@/lib/schema/validation/player-validation"

// utils
import { logError } from "@/lib/util/error"
import { cn } from "@/lib/util"

// icons
import { Check, Loader2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { Form } from "@/components/shared"
import PlayerProfileFormFields from "./player-profile-form-fields"

// hooks
import { useCreatePlayerAction, useUpdatePlayerAction } from "@/lib/safe-action/player"

type PlayerProfileFormProps = ({
  type?: "create"
  defaultValues?: DefaultValues<CreatePlayerValidation>
} | {
  type?: "edit"
  defaultValues: Required<DefaultValues<CreatePlayerValidation>>
}) & Omit<React.ComponentProps<typeof Form>, "form" | "onSubmit">

const PlayerProfileForm = ({ type = "create", defaultValues, className, ...props }: PlayerProfileFormProps) => {
  const form = useForm<CreatePlayerValidation>({
    resolver: zodResolver(createPlayerValidation),
    defaultValues: {
      tag: defaultValues?.tag ?? '',
      color: defaultValues?.color ?? '#82aa82'
    }
  })

  const {
    executeAsync: executeCreatePlayer,
    status: createPlayerStatus
  } = useCreatePlayerAction()

  const {
    executeAsync: executeUpdatePlayer,
    status: updatePlayerStatus
  } = useUpdatePlayerAction()

  const handleExecute = async (values: CreatePlayerValidation) => {
    try {
      if (type === "create") {
        await executeCreatePlayer(values)
      }

      if (type === "edit") {
        await executeUpdatePlayer({
          previousTag: defaultValues?.tag!,
          ...values
        })
      }

      form.reset()
    } catch (err) {
      logError(err)
    }
  }

  return (
    <Form className={cn("mt-5 flex items-center gap-x-2", className)}
      form={form}
      onSubmit={handleExecute}
      {...props}
    >
      <PlayerProfileFormFields form={form} />

      <Button className="ml-3 p-2 border border-border/15 rounded-2xl hover:bg-transparent/5 dark:hover:bg-transparent/40"
        tooltip={type === "create" ? "Create" : `Update "${defaultValues?.tag}"`}
        variant="ghost"
        size="icon"
        disabled={createPlayerStatus === 'executing' || updatePlayerStatus === "executing"}
      >
        {createPlayerStatus === 'executing' || updatePlayerStatus === "executing" ? (
          <Loader2 className="size-4 shrink-0 text-accent animate-spin"
            strokeWidth={2.5}
          />
        ) : (
          <Check className="size-4 shrink-0 text-accent"
            strokeWidth={4}
          />
        )}
      </Button>
    </Form>
  )
}

export default PlayerProfileForm
