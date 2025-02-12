// clerk
import { verifyToken } from "@clerk/express"

export const authenticate: SocketMiddlewareFn = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token

    if (!token) {
      return next(new Error("Authentication error: Token is missing."))
    }

    const session = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    })

    if (!session) {
      return next(new Error("Authentication error: Invalid token."))
    }

    socket.clerkId = session.sub
    next()
  } catch (err) {
    console.error("Socket authentication error: ", err)
    return next(new Error("Authentication failed!"))
  }
}
