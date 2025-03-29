export const connectionClear: SocketEventHandler = (socket) => () => {
  socket.ctx.connection = undefined!
}
