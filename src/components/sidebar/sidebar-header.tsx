import Link from "next/link"

// icons
import { Spade } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

const SidebarHeader = () => {
  return (
    <>
      <Link className="mt-1.5 flex gap-x-2.5"
        href="/"
      >
        <Spade className="size-6" />
        <p className="text-2xl font-semibold">
          memory/pvp
        </p>
      </Link>

      <Separator className="my-4" />
    </>
  )
}

export default SidebarHeader
