"use client"

import { z } from "zod"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { createPlayerSchema } from "@/lib/validations/player-schema"

// icons
import { Check, Loader2 } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"

// components
import { Form } from "@/components/shared"
import PlayerProfileFormFields from "./player-profile-form-fields"

// hooks
import { useForm } from "react-hook-form"
import { useCreatePlayerMutation } from "@/lib/react-query/mutations/player"

type PlayerProfileFormValues = z.infer<typeof createPlayerSchema>

const PlayerProfileForm = () => {
  const form = useForm<PlayerProfileFormValues>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      tag: '',
      color: '#92aa92'
    }
  })

  const { createPlayer, onSubmit } = useCreatePlayerMutation({ onAfterSuccess: form.reset })

  return (
    <Form<PlayerProfileFormValues>
      className="flex items-center gap-x-4"
      form={form}
      onSubmit={onSubmit}
    >
      <PlayerProfileFormFields form={form} />

      <ButtonTooltip className="ml-3 p-1.5 hover:bg-transparent/5 dark:hover:bg-transparent/40"
        tooltip="Add player profile"
        variant="ghost"
        size="icon"
        disabled={createPlayer.isPending}
      >
        {createPlayer.isPending ? (
          <Loader2 className="size-5 text-accent animate-spin"
            strokeWidth={4}
          />
        ) : (
          <Check className="size-5 text-accent"
            strokeWidth={4}
          />
        )}
      </ButtonTooltip>
    </Form>
  )
}

export default PlayerProfileForm
export type { PlayerProfileFormValues }
