export const connectionClear: SocketEventHandler = (socket) => () => {
  console.log("DEBUG - connection:clear -> ", socket.id)
  socket.ctx.connection = undefined!
}
