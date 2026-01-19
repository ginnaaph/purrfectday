import React from 'react'
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar
} from './ui/sidebar'
import Charge from '@/assets/images/icons/charge.png'
import { UserCard } from '@/components/userCard'
import { items, ProductivityItems, RechargeItems } from '../sidebar-items'
import { NavLink } from 'react-router'
import { ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/collapsible/ui/collapsible'
import { cn } from '@/libs/utils'

export const AppSidebar = () => {
  const { state } = useSidebar()
  const [productivityOpen, setProductivityOpen] = React.useState(true)
  const [rechargeOpen, setRechargeOpen] = React.useState(true)
  const isExpanded = state === 'expanded'

  return (
    <Sidebar side="left" collapsible="icon" className="overflow-hidden min-w-0 h-screen flex w-fit">
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
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0',
                    isActive && 'font-semibold'
                  )
                }
              >
                <img src={item.icon} alt="" className="h-5 w-5" />
                <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarMenu className="pt-3">
        <Collapsible
          open={isExpanded ? productivityOpen : false}
          onOpenChange={setProductivityOpen}
          className="group/collapsible"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Productivity" disabled={!isExpanded}>
              <img src={ProductivityItems[0].icon} alt="" className="h-5 w-5" />
              <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
                Productivity
              </span>
              <ChevronDown className="ml-auto -mr-2 size-4 shrink-0 self-center text-primary-alt/70 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              {ProductivityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0',
                          isActive && 'font-semibold'
                        )
                      }
                    >
                      <div className="ml-6 pl-4 flex items-center gap-2 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:justify-center">
                        <img src={item.icon} alt="" className="h-5 w-5" />
                        <span className="text-md font-semibold group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
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
        <Collapsible
          open={isExpanded ? rechargeOpen : false}
          onOpenChange={setRechargeOpen}
          className="group/collapsible"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Recharge" disabled={!isExpanded}>
              <img src={Charge} alt="" className="h-5 w-5" />
              <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
                Recharge
              </span>
              <ChevronDown className="ml-auto -mr-2 size-4 shrink-0 self-center text-primary-alt/70 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              {RechargeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0',
                          isActive && 'font-semibold'
                        )
                      }
                    >
                      <div className="ml-6 pl-4 flex items-center gap-2 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:justify-center">
                        <img src={item.icon} alt="" className="h-5 w-5" />
                        <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
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
