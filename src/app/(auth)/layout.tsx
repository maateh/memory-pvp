const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  )
}

export default AuthLayout