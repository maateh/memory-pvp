"use client"

import { useState } from "react"

// icons
import { Check, Copy } from "lucide-react"

type UserInfoItemProps = {
  label: string
  info: string
  icon: React.ReactNode
}

const UserInfoItem = ({ label, info, icon }: UserInfoItemProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(info)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000);
  }

  return (
    <div className="flex items-center gap-x-3.5">
      <div className="w-10 flex justify-center">
        {icon}
      </div>

      <div className="group flex items-center gap-x-4 cursor-pointer"
        onClick={handleCopy}
      >
        <div className="font-mono">
          <span className="text-muted-foreground">{label} | </span>
          <span className="blur-sm group-hover:blur-none">{info}</span>
        </div>

        {copied ? (
          <Check className="size-4"
            onClick={handleCopy}
          />
        ) : (
          <Copy className="size-4"
            onClick={handleCopy}
          />
        )}
      </div>

    </div>
  )
}

export default UserInfoItem
