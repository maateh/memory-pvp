// lib
import { currentProfile } from "@/lib/db/current-profile"
import { db } from "@/lib/db"

// types
import { PlayerProfileFormValues } from "@/components/form/player-profile-form"

async function GET(req: Request) {
  try {

  } catch (err) {
    console.error('[PLAYERS_GET]', err)
    return new Response('Internal Error', { status: 500 })
  }
}

async function POST(req: Request) {
  try {
    const profile = await currentProfile()

    const { playerTag, color } = await req.json() as PlayerProfileFormValues
    
    const player = await db.player.create({
      data: {
        profileId: profile.id,
        tag: playerTag,
        color
      }
    })

    return Response.json(player)
  } catch (err) {
    console.error('[PLAYERS_POST]', err)
    return new Response('Internal Error', { status: 500 })
  }  
}

export { GET, POST }
