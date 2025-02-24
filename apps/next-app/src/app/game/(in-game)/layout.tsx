type InGameLayoutProps = {
  children: React.ReactNode
}

const InGameLayout = ({ children }: InGameLayoutProps) => {
  return (
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  )
}

export default InGameLayout
