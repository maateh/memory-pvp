"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Button } from "@/components/ui/button"

// icons
import { LoaderCircle } from "lucide-react"

const SessionLoader = () => {
  const [disabled, setDisabled] = useState<boolean>(true)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDisabled(false)
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [setDisabled])

  return (
    <main className="flex-1 w-full relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoaderCircle className="size-12 sm:size-14 md:size-16 shrink-0 text-muted-foreground animate-spin" />
      </div>

      <div className={cn("flex flex-col gap-y-2 items-center animate-in slide-in-from-bottom-16 duration-1000 absolute m-auto bottom-16 left-0 right-0", {
        "hidden": disabled
      })}>
        <p className="text-center text-xl sm:text-2xl font-heading font-bold tracking-wide heading-decorator">
          Session not loading?
        </p>

        <Button className="font-heading sm:text-base sm:tracking-wide"
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
      </div>
    </main>
  )
}

export default SessionLoader
