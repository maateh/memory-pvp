type BaseGameSetupLayoutProps = {
  collections: React.ReactNode
  warning: React.ReactNode
  children: React.ReactNode
}

const BaseGameSetupLayout = ({ collections, warning, children }: BaseGameSetupLayoutProps) => {
  return (
    <>
      {collections}
      {warning}
      {children}
    </>
  )
}

export default BaseGameSetupLayout
