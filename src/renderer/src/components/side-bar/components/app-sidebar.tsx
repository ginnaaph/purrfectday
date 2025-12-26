import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from './ui/sidebar'
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react'

// menu items
const items = [
  {
    title: 'Today',
    url: '/today',
    icon: Home
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar
  },
  {
    title: 'Search',
    url: '#',
    icon: Search
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

export function AppSidebar() {
  return (
    <Sidebar >
      <SidebarContent className="gap-2 p-1 text-primary mt-5">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} >
                  <item.icon />
                  <span className="text-primary text-lg font-semibold">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
