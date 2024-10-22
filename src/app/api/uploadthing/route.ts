// uploadthing
import { createRouteHandler } from "uploadthing/next"
import { uploadRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,

  // Custom config (optional):
  // config: {}
})
