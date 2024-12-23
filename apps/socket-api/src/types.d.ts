/* Base schemas */
declare type ClientPlayer = {
  id: string
  tag: string
  username: string
  imageUrl: string
  color: string
}

declare type SessionRoom = {
  id: string
  status: "waiting" | "starting" | "running" | "finished"
  owner: ClientPlayer
  guest: ClientPlayer
  session: ClientGameSession
}

declare type ClientGameSession = SessionFormValues & {
  slug: string
}

/* Forms / API validations */
declare type SessionFormValues = { // TODO: use zod validation instead
  type: "CASUAL" | "COMPETITIVE"
  mode: "COOP" | "PVP"
  size: "SMALL" | "MEDIUM" | "LARGE"
  collectionId: string
}

/* Room (status) types */
declare type WaitingRoom = {
  id: string
  owner: ClientPlayer
  settings: SessionFormValues
}
