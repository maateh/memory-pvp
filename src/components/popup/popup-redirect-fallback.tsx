"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type PopupRedirectFallbackProps = {
  message?: string
  description?: string
}

const PopupRedirectFallback = ({ message, description = '' }: PopupRedirectFallbackProps) => {
  const router = useRouter()
  const hasRedirected = useRef<boolean>(false)

  useEffect(() => {
    if (!hasRedirected.current) {
      if (message) {
        toast.warning(message, { description })
      }
      
      hasRedirected.current = true
      router.back()
    }
  }, [message, description, router])

  return null
}

export default PopupRedirectFallback
