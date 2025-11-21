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

  const storeUser = (user: User | undefined) => {
    setUser(user)
  }

  const updateNavigationList = setNavigationList
  const updateBreadcrumbList = setBreadcrumbList;

  return (
    <DashboardContext.Provider value={{
      user,
      navigationList,
      breadcrumbList,
      storeUser,
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
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error('useDashboard must be used within an DashboardProvider');
  }

  return context;
}