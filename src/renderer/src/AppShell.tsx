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
        <div className="main-content-wrapper flex-1 flex flex-col max-w-full overflow-hidden h-screen ml-3 overflow-y-auto   min-w-0 pr-7">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
