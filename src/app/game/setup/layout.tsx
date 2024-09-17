type GameSetupLayoutProps = {
  warning: React.ReactNode
  children: React.ReactNode
}

const GameSetupLayout = ({ warning, children }: GameSetupLayoutProps) => {
  return (
    <>
      {warning}
      {children}
    </>
  )
}

export default GameSetupLayout
