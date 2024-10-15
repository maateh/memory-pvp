"use server"

// prisma
import type { GameSession } from "@prisma/client"

// server
import { db } from "@/server/db"
import { signedIn } from "@/server/actions/signed-in"

// helpers
import { parseSchemaToClientSession } from "@/lib/helpers/session"

export async function getClientSession(
  filter: Pick<GameSession, 'id'> | Pick<GameSession, 'slug'> | Pick<GameSession, 'id' | 'slug'>
): Promise<ClientGameSession | null> {
  const user = await signedIn()
  if (!user) return null

  const session = await db.gameSession.findUnique({
    where: filter,
    include: {
      owner: {
        include: {
          user: {
            select: { imageUrl: true }
          }
        }
      },
      players: {
        include: {
          user: {
            select: { imageUrl: true }
          }
        }
      }
    }
  })

  if (!session) return null

  const hasAccess = session.players.some((player) => player.userId === user.id)
  if (!hasAccess) return null

  const player = session.players.find((player) => player.userId === user.id)

  const clientSession = parseSchemaToClientSession(session, player!.tag)
  return clientSession
}
