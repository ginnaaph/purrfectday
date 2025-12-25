import { useNavigate } from 'react-router'

interface AppShellProps {
  children?: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen bg-primary-background w-full flex-col overflow-hidden">
   
      <main className="flex ">{children}</main>

    </div>
  )
}
