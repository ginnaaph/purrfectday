import { useSidebar } from './ui/sidebar'
import { Hamburger } from 'lucide-react'
export const SidebarTrigger = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <button onClick={toggleSidebar}>
      <Hamburger />
    </button>
  )
}
