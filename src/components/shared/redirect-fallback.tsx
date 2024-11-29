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
  redirect = '/',
  type = "push",
  message,
  description = '',
  children
}: RedirectFallbackProps) => {
  const router = useRouter()
  const hasRedirected = useRef<boolean>(false)

  useEffect(() => {
    if (!hasRedirected.current) {
      if (message) {
        /* Note: prevent re-render by adding a custom id. */
        toast.warning(message, { description, id: '_' })
      }

      switch (type) {
        case 'back': router.back()
        case 'push': router.push(redirect, { scroll: false })
        case 'replace': router.replace(redirect, { scroll: false })
        default: router.back()
      }
    }
  }, [router])

  return children
}

export default RedirectFallback