import SuperJSON from "superjson"

import {
  defaultShouldDehydrateQuery,
  QueryClient
} from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending'
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize
      }
    }
  })
}
