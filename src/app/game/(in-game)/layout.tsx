type InGameLayoutProps = {
  children: React.ReactNode
}

const InGameLayout = ({ children }: InGameLayoutProps) => {
  return (
    <div className="w-full mx-auto flex flex-col items-center gap-y-2 bg-foreground/10 rounded-xl">
      {children}
    </div>
  )
}

export default InGameLayout
