import { redirect } from "next/navigation"

// clerk
import { auth } from "@clerk/nextjs/server"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Logo } from "@/components/shared"

const HomePage = () => {
  const { userId: clerkId } = auth()
  if (clerkId) redirect('/dashboard')

  return (
    <>
      <div className="px-2.5 py-3.5 flex items-center gap-x-1.5 md:hidden">
        <Separator className="h-8 bg-foreground/40"
          orientation="vertical"
        />

        <Logo className="ml-1.5"
          withRedirect
        />
      </div>

      <div>
        <p className="text-2xl p-8 font-light">light</p>
        <p className="text-2xl p-8 font-normal">normal</p>
        <p className="text-2xl p-8 font-medium">medium</p>
        <p className="text-2xl p-8 font-semibold">semibold</p>
        <p className="text-2xl p-8 font-bold">bold</p>
      </div>
    </>
  )
}

export default HomePage
