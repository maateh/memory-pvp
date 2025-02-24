const GameLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="min-h-screen p-1 mx-auto flex flex-col md:p-2 md:max-w-screen-lg lg:max-w-screen-2xl">
      <div className="flex-1 flex bg-primary border-2 border-border/15 rounded-lg md:rounded-2xl">
        {children}
      </div>
    </div>
  )
}

export default GameLayout
