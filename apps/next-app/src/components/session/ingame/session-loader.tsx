"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Button } from "@/components/ui/button"

// icons
import { LoaderCircle } from "lucide-react"

const SessionLoader = () => {
  const [disabled, setDisabled] = useState<boolean>(true)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDisabled(false)
    }, 7000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [setDisabled])

  return (
    <main className="flex-1 w-full flex flex-col justify-center items-center gap-y-6">
      <p className={cn("w-fit mx-auto px-6 text-foreground/80 text-center text-2xl sm:text-3xl font-heading font-bold tracking-wide animate-in slide-in-from-top-32 duration-700", {
        "hidden": disabled
      })}>
        Session not loading?
      </p>

      <LoaderCircle className="size-12 sm:size-14 md:size-16 shrink-0 text-foreground/40 animate-spin" />

      <Button className={cn("font-heading text-foreground/80 text-base sm:text-lg sm:tracking-wide animate-in slide-in-from-bottom-32 duration-700 transition-none", {
        "hidden": disabled
      })}
        variant="ghost"
        size="lg"
        disabled={disabled}
        asChild
      >
        <Link href="/game/setup" replace>
          <span className="mt-1">
            Start a new one
          </span>
        </Link>
      </Button>
    </main>
  )
}

export default SessionLoader
