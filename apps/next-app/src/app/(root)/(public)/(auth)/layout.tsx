const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="h-full flex items-center justify-center">
      {children}
    </div>
  )
}

export default AuthLayout
