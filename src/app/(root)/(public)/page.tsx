import { redirect } from "next/navigation"

// clerk
import { auth } from "@clerk/nextjs/server"

const HomePage = () => {
  const { userId: clerkId } = auth()
  if (clerkId) redirect('/dashboard')

  // TODO: design `Home`
  return (
    <div>
      HomePage
    </div>
  )
}

export default HomePage
