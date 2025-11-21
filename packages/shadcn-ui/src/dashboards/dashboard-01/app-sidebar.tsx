"use client"

import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar"
import Navigation from "./navigation"
import { AppSidebarProps } from "./types"
import KubisSvg from "../../custom-components/kubis-svg"

export function AppSidebar({ navigations, navigationUserItems, user, appName, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <KubisSvg className="size-5!" />
                <span className="text-base font-semibold">{appName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Navigation navigation={navigations} />
      </SidebarContent>
      {user &&
        <SidebarFooter>
          <NavUser items={navigationUserItems} user={user} />
        </SidebarFooter>
      }
    </Sidebar>
  )
}
