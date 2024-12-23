type BaseGameSetupLayoutProps = {
  popup: React.ReactNode
  children: React.ReactNode
}

const BaseGameSetupLayout = ({ popup, children }: BaseGameSetupLayoutProps) => {
  return (
    <>
      {popup}
      {children}
    </>
  )
}

export default BaseGameSetupLayout
