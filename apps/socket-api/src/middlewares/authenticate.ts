// clerk
import { verifyToken } from "@clerk/express"

// utils
import { ServerError } from "@repo/server/error"

export const authenticate: SocketMiddlewareFn = async (socket, next) => {
  const ctx = socket.ctx || {}

  try {
    const token = socket.handshake.auth?.token

    if (!token) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "CLERK_TOKEN_MISSING",
        message: "Authentication failed.",
        description: "Token is missing. Please try logging into your account again."
      })
    }

    const session = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    })

    if (!session) {
      ServerError.throw({
        thrownBy: "SOCKET_API",
        key: "CLERK_TOKEN_INVALID",
        message: "Authentication failed.",
        description: "Invalid token. Please try logging into your account again."
      })
    }

    socket.ctx = { ...ctx, clerkId: session.sub }
    next()
  } catch (err) {
    if ((err as any).reason === "token-expired") {
      err = new ServerError({
        thrownBy: "SOCKET_API",
        key: "CLERK_TOKEN_EXPIRED",
        message: "Authentication failed.",
        description: "Token is expired. Please try reconnecting or reload this page."
      })
    }
    
    return next(ServerError.asSocketError(err))
  }
}
