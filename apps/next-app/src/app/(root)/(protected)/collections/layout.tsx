type CollectionsLayoutProps = {
  children: React.ReactNode
}

const CollectionsLayout = ({ children }: CollectionsLayoutProps) => {
  return (
    <div className="page-wrapper">
      {children}
    </div>
  )
}

export default CollectionsLayout
