import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from './ui/sidebar'
import Charge from '@/assets/images/icons/charge.png'
import { UserCard } from '@/components/userCard'
import { items, ProductivityItems, RechargeItems } from '../sidebar-items'
import { NavLink } from 'react-router'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/collapsible/ui/collapsible'

export const AppSidebar = () => {
  return (
    <Sidebar
      side="left"
      collapsible="icon"
      className="overflow-hidden min-w-0 h-screen flex shrink-0"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserCard />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) => (isActive ? 'font-semibold' : undefined)}
              >
                <img src={item.icon} alt="" className="h-5 w-5" />
                <span className="text-lg font-semibold">{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarMenu className="pt-3">
        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Productivity">
              <img src={ProductivityItems[0].icon} alt="" className="h-5 w-5" />
              <span className="text-lg font-semibold">Productivity</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              {ProductivityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => (isActive ? 'font-semibold' : undefined)}
                    >
                      <div className="ml-6 pl-4 flex items-center gap-2">
                        <img src={item.icon} alt="" className="h-5 w-5" />
                        <span className="text-md font-semibold">{item.title}</span>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
      <SidebarMenu className="pt-3">
        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Recharge">
              <img src={Charge} alt="" className="h-5 w-5" />
              <span className="text-lg font-semibold">Recharge</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              {RechargeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => (isActive ? 'font-semibold' : undefined)}
                    >
                      <div className="ml-6 pl-4 flex items-center gap-2">
                        <img src={item.icon} alt="" className="h-5 w-5" />
                        <span className="text-lg font-semibold">{item.title}</span>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </Sidebar>
  )
}
