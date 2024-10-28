// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// helpers
import { parseSchemaToClientCollection } from "@/lib/helpers/collection"

/**
 * TODO: write doc
 * 
 * @param filter 
 * @returns 
 */
export async function getUserCollections(): Promise<ClientCardCollection[]> {
  const user = await signedIn()
  if (!user) return []

  const collections = await db.cardCollection.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true,
      cards: true
    }
  })

  return collections.map((collection) => parseSchemaToClientCollection(collection))
}
