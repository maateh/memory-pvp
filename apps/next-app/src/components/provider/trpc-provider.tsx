"use client"

import SuperJSON from "superjson"

import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"

// types
import type { QueryClient } from "@tanstack/react-query"

// trpc
import { httpBatchLink } from "@trpc/client"

import { trpc } from "@/server/trpc/client"
import { makeQueryClient } from "@/server/trpc/query-client"

let clientQueryClientSingleton: QueryClient
function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient()
  }
  return (clientQueryClientSingleton ??= makeQueryClient())
}

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return ""
    if (process.env.NODE_ENV !== "development") return process.env.NEXT_PUBLIC_SERVER_URL
    return "http://localhost:3000"
  })()
  return `${base}/api/trpc`
}

const TRPCProvider = (props: Readonly<{ children: React.ReactNode }>) => {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(
    () => trpc.createClient({
      links: [
        httpBatchLink({
          transformer: SuperJSON,
          url: getUrl()
        })
      ]
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient} {...props} />
    </trpc.Provider>
  )
}

export default TRPCProvider
