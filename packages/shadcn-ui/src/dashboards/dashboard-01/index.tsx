"use client";

import { createContext, useContext, useState } from "react";
import { SidebarInset, SidebarProvider } from "./sidebar";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import { BreadcrumbItem, DashboardContextType, DashboardProviderProps, User } from "./types";

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children, ...props }: DashboardProviderProps) {
  const [navigationList, setNavigationList] = useState(props.navigations);
  const [user, setUser] = useState<User | undefined>(props.user)
  const [breadcrumbList, setBreadcrumbList] = useState<BreadcrumbItem[]>([])

  const updateUser = setUser
  const updateNavigationList = setNavigationList
  const updateBreadcrumbList = setBreadcrumbList;

  return (
    <DashboardContext.Provider value={{
      user,
      navigationList,
      breadcrumbList,
      updateUser,
      updateNavigationList,
      updateBreadcrumbList
    }}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" navigations={navigationList} navigationUserItems={props.userCardItems} user={user} appName={props.appName} />
        <SidebarInset>
          <SiteHeader items={breadcrumbList} />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </DashboardContext.Provider>
  )
}

export function useDashboard01() {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error('useDashboard must be used within an DashboardProvider');
  }

  return context;
}