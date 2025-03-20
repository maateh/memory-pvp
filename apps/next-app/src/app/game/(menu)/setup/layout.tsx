type GameSetupLayoutProps = {
  popup: React.ReactNode
  children: React.ReactNode
}

const GameSetupLayout = ({ popup, children }: GameSetupLayoutProps) => {
  return (
    <>
      {popup}
      {children}
    </>
  )
}

export default GameSetupLayout
