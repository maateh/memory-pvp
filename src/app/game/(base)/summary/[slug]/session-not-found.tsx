"use client"

import { redirect } from "next/navigation"

import { toast } from "sonner"

const SessionNotFound = () => {
  toast.warning("Session not found.", {
    description: "Sorry, but the session cannot be found or you don't have access to it.",
    id: '_' /** Note: prevent re-render by adding a custom id. */
  })
  redirect('/game/setup')
}

export default SessionNotFound
