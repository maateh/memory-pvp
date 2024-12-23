const GameLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="min-h-screen mx-auto flex flex-col md:max-w-screen-lg lg:max-w-screen-2xl">
      <div className="flex-1 flex m-1 bg-primary border-2 border-background/60 rounded-lg md:m-2.5 md:rounded-2xl">
        {children}
      </div>
    </div>
  )
}

export default GameLayout
