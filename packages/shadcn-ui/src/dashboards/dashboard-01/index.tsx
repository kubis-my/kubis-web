'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { SidebarInset, SidebarProvider } from './sidebar';
import { AppSidebar } from './app-sidebar';
import { SiteHeader } from './site-header';
import { BreadcrumbItem, DashboardContextType, DashboardProviderProps, User } from './types';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children, ...props }: DashboardProviderProps) {
    const [navigationList, setNavigationList] = useState(props.navigations);
    const [user, setUser] = useState<User | undefined>(props.user);
    const [breadcrumbList, setBreadcrumbList] = useState<BreadcrumbItem[]>([]);
    const [headerAction, setHeaderAction] = useState<React.ReactNode>(undefined);

    const contextValue = useMemo(
        () => ({
            user,
            navigationList,
            breadcrumbList,
            headerAction,
            updateUser: setUser,
            updateNavigationList: setNavigationList,
            updateBreadcrumbList: setBreadcrumbList,
            updateHeaderAction: setHeaderAction,
        }),
        [user, navigationList, breadcrumbList, headerAction],
    );

    return (
        <DashboardContext.Provider value={contextValue}>
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': 'calc(var(--spacing) * 72)',
                        '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                }
                defaultOpen={false}
            >
                <AppSidebar
                    variant="inset"
                    navigations={navigationList}
                    navigationUserItems={props.userCardItems}
                    user={user}
                    appName={props.appName}
                />
                <SidebarInset>
                    <SiteHeader items={breadcrumbList} action={headerAction} />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </DashboardContext.Provider>
    );
}

export function useDashboard01() {
    const context = useContext(DashboardContext);

    if (context === undefined) {
        throw new Error('useDashboard must be used within an DashboardProvider');
    }

    return context;
}
