// providers
import { SessionRoomProvider } from "@/components/provider"

// components
import { SessionFooter, SessionHeader } from "@/components/session/ingame"
import MultiGameHandler from "./multi-game-handler"

const MultiGamePage = () => {
  return (
    // TODO: get `room` from redis cache
    <SessionRoomProvider initialRoom={{}}>
      {/* TODO: use useSessionStore() instead of passing props */}
      {/* <SessionHeader session={session} /> */}

      <MultiGameHandler />

      <SessionFooter />
    </SessionRoomProvider>
  )
}

export default MultiGamePage
