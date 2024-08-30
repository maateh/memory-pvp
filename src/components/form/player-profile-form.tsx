"use client"

import { z } from "zod"

import { useRouter } from "next/navigation"

import { UseFormReturn } from "react-hook-form"

// trpc
import { api } from "@/trpc/client"

// lib
import { playerProfileFormSchema } from "@/lib/validations"

// icons
import { Check } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// components
import { Form } from "@/components/form"
import { ColorPicker } from "@/components/inputs"

type PlayerProfileFormValues = z.infer<typeof playerProfileFormSchema>

const PlayerProfileForm = () => {
  const router = useRouter()

  const createPlayer = api.player.create.useMutation({
    onSuccess: () => {
      router.refresh()
    }
  })

  const onSubmit = async (values: PlayerProfileFormValues, form: UseFormReturn<PlayerProfileFormValues>) => {
    try {
      await createPlayer.mutateAsync(values)

      form.reset()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Form<PlayerProfileFormValues>
      className="flex items-center gap-x-4"
      schema={playerProfileFormSchema}
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
    
          <Button className="ml-3 p-1.5 hover:bg-transparent/5 dark:hover:bg-transparent/40"
            variant="ghost"
            size="icon"
          >
            <Check className="size-5 text-accent"
              strokeWidth={4}
            />
          </Button>
        </>
      )}
    </Form>
  )
}

export default PlayerProfileForm
