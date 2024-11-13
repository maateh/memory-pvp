"use client"

import { useEffect } from "react"

// hooks
import { useSidebar } from "@/components/ui/sidebar"

const SidebarCollapse = () => {
  const { setOpen } = useSidebar()

  useEffect(() => {
    setOpen(false)
    
    return () => {
      setOpen(true)
    }
  }, [setOpen])

  return null
}

export default SidebarCollapse
