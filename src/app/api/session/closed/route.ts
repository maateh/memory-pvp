// actions
import { saveSession } from "@/server/actions/session"

export async function POST(req: Request) {
  try {
    const clientSession = await req.json() as ClientGameSession
    await saveSession(clientSession)

    return Response.json({ status: 'OK' })
  } catch (err) {
    return new Response('[API | POST - /session/closed] Failed to save closed session.', { status: 500 })
  }  
}
