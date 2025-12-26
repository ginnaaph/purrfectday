import { SidebarTrigger } from '@/components/side-bar/components/ui/sidebar'

export const HeaderBar = () => {
  return (
    <header className="flex items-center gap-2 h-12 px-3 border-b bg-background">
      <SidebarTrigger />
      <span className="font-semibold">Purrfect Day</span>
    </header>
  )
}
