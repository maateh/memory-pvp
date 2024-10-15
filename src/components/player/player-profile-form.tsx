"use client"

import { z } from "zod"

// lib
import { createPlayerSchema } from "@/lib/validations/player-schema"

// icons
import { Check, Loader2 } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import { Form } from "@/components/shared"
import { ColorPicker } from "@/components/inputs"

// hooks
import { useCreatePlayerMutation } from "@/lib/react-query/mutations/player"

export type PlayerProfileFormValues = z.infer<typeof createPlayerSchema>

const PlayerProfileForm = () => {
  const { createPlayer, onSubmit } = useCreatePlayerMutation()

  return (
    <Form<PlayerProfileFormValues>
      className="flex items-center gap-x-4"
      schema={createPlayerSchema}
      onSubmit={onSubmit}
      defaultValues={{
        tag: '',
        color: '#92aa92'
      }}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Player Tag
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
    
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
    
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
        </>
      )}
    </Form>
  )
}

export default PlayerProfileForm
