"use client"

import { z } from "zod"

import { useRouter } from "next/navigation"

import { UseFormReturn } from "react-hook-form"

// trpc
import { TRPCClientError } from "@trpc/client"
import { api } from "@/trpc/client"

// lib
import { playerProfileCreateSchema } from "@/lib/validations"

// icons
import { Check } from "lucide-react"

// shadcn
import { ButtonTooltip } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import { Form } from "@/components/form"
import { ColorPicker } from "@/components/inputs"

type PlayerProfileFormValues = z.infer<typeof playerProfileCreateSchema>

const PlayerProfileForm = () => {
  const router = useRouter()
  const utils = api.useUtils()

  const createPlayer = api.playerProfile.create.useMutation({
    onSuccess: async () => {
      // TODO: add toast
      router.refresh()

      await utils.user.getWithPlayerProfiles.invalidate()
    },
    onError: () => {
      // TODO: add toast
    }
  })

  const onSubmit = async (values: PlayerProfileFormValues, form: UseFormReturn<PlayerProfileFormValues>) => {
    try {
      await createPlayer.mutateAsync(values)

      form.reset()
    } catch (err) {
      throw new TRPCClientError('Failed to create player profile', { cause: err as Error })
    }
  }

  return (
    <Form<PlayerProfileFormValues>
      className="flex items-center gap-x-4"
      schema={playerProfileCreateSchema}
      onSubmit={onSubmit}
      defaultValues={{
        playerTag: '',
        color: '#92aa92'
      }}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="playerTag"
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
          >
            <Check className="size-5 text-accent"
              strokeWidth={4}
            />
          </ButtonTooltip>
        </>
      )}
    </Form>
  )
}

export default PlayerProfileForm
