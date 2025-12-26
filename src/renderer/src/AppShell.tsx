import { useNavigate } from 'react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/side-bar/components/ui/sidebar'
import { AppSidebar } from '@/components/side-bar/components/app-sidebar'

interface AppShellProps {
  children?: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
