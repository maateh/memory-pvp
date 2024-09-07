declare type UnsignedGameSessionClient = {
  sessionId: string
  status: GameStatus
  type: GameType
  mode: GameMode
  tableSize: TableSize
  startedAt: Date
}
