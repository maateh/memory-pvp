type BaseGameSetupLayoutProps = {
  warning: React.ReactNode
  children: React.ReactNode
}

const BaseGameSetupLayout = ({ warning, children }: BaseGameSetupLayoutProps) => {
  return (
    <>
      {warning}
      {children}
    </>
  )
}

export default BaseGameSetupLayout
