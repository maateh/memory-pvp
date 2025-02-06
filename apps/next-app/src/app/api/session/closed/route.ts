// types
import type { ClientGameSession } from "@repo/schema/session"

// actions
import { saveSession } from "@/server/action/session-action"

export async function POST(req: Request) {
  try {
    const clientSession = await req.json() as ClientGameSession
    await saveSession(clientSession)

    return Response.json({ status: 'OK' })
  } catch (err) {
    return new Response('[API | POST - /session/closed] Failed to save closed session.', { status: 500 })
  }  
}
