// uploadthing
import { createRouteHandler } from "uploadthing/next"

// server
import { uploadRouter } from "@/server/uploadthing/core"

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,

  // Custom config (optional):
  // config: {}
})
