import { useState } from "react"
import { toast } from "sonner"

type UseCopyProps = {
  showToast?: boolean
}

export const useCopy = ({ showToast = false }: UseCopyProps = {}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    
    if (showToast) {
      toast.success("Copied to the clipboard.", { description: text })
    }

    setTimeout(() => setCopied(false), 2000);
  }

  return { copied, handleCopy }
}
