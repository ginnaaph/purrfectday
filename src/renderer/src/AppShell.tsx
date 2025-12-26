import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/components/side-bar/components/ui/sidebar'
import { AppSidebar } from '@/components/side-bar/components/app-sidebar'

interface AppShellProps {
  children?: React.ReactNode
  cookies?: string
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarTrigger />
      <SidebarInset>

      <main className="ml-5 items-center">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
