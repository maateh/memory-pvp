"use client"

import SuperJSON from 'superjson'

import { useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

// trpc
import { httpBatchLink } from '@trpc/client'

import { api as trpc } from '@/trpc/client'
import { makeQueryClient } from '@/trpc/query-client'

let clientQueryClientSingleton: QueryClient
function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()
  }
  return (clientQueryClientSingleton ??= makeQueryClient())
}

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return ''
    if (process.env.NODE_ENV !== 'development') return `https://${process.env.NEXT_PUBLIC_SERVER_URL}`
    return 'http://localhost:3000'
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
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default TRPCProvider
