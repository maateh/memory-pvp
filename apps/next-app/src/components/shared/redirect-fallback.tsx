"use client"

import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type RedirectFallbackProps = {
  redirect?: string
  type?: "push" | "replace" | "back"
  message?: string
  description?: string
  children?: React.ReactNode
}

const RedirectFallback = ({
  redirect = "",
  type = "push",
  message,
  description = "",
  children
}: RedirectFallbackProps) => {
  const router = useRouter()
  const hasRedirected = useRef<boolean>(false)

  useEffect(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true

      if (message) {
        /* Note: prevent re-render by adding a custom id. */
        toast.warning(message, { description, id: '_' })
      }

      switch (type) {
        case "back": router.back()
        case "push": router.push(redirect, { scroll: false })
        case "replace": router.replace(redirect, { scroll: false })
      }
    }
  }, [router, type, message, description, redirect])

  return children
}

export default RedirectFallback
