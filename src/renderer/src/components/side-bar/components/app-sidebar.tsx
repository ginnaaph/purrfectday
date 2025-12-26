import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarGroup,
  SidebarProvider
} from './ui/sidebar'
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react'
import { UserCard } from '@/components/userCard'


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

export const AppSidebar = () => {
  return (
    
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader>
        <UserCard />
      </SidebarHeader>

      <SidebarContent className="text-primary mt-2">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
   
  )
}
