"use client"

import { z } from "zod"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { createPlayerSchema } from "@/lib/validations/player-schema"

// icons
import { Check, Loader2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

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
      color: '#82aa82'
    }
  })

  const { createPlayer, onSubmit } = useCreatePlayerMutation({ onAfterSuccess: form.reset })

  return (
    <Form<PlayerProfileFormValues>
      className="mt-5 flex items-center gap-x-2"
      form={form}
      onSubmit={onSubmit}
    >
      <PlayerProfileFormFields form={form} />

      <Button className="ml-3 p-2 border border-border/15 rounded-2xl hover:bg-transparent/5 dark:hover:bg-transparent/40"
        tooltip="Create"
        variant="ghost"
        size="icon"
        disabled={createPlayer.isPending}
      >
        {createPlayer.isPending ? (
          <Loader2 className="size-4 text-accent animate-spin"
            strokeWidth={2.5}
          />
        ) : (
          <Check className="size-4 text-accent"
            strokeWidth={4}
          />
        )}
      </Button>
    </Form>
  )
}

export default PlayerProfileForm
export type { PlayerProfileFormValues }
