'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { SidebarInset, SidebarProvider } from './sidebar';
import { AppSidebar } from './app-sidebar';
import { SiteHeader } from './site-header';
import {
    BreadcrumbItem,
    DashboardContextType,
    DashboardProviderProps,
    NavMainItem,
    Project,
    User,
    Workspace,
} from './types';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children, ...props }: DashboardProviderProps) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>(props.workspaces);
    const [navMain, setNavMain] = useState<NavMainItem[]>(props.navMain);
    const [projects, setProjects] = useState<Project[]>(props.projects);
    const [user, setUser] = useState<User | undefined>(props.user);
    const [breadcrumbList, setBreadcrumbList] = useState<BreadcrumbItem[]>([]);
    const [headerAction, setHeaderAction] = useState<React.ReactNode>(undefined);

    const contextValue = useMemo(
        () => ({
            user,
            workspaces,
            navMain,
            projects,
            breadcrumbList,
            headerAction,
            updateUser: setUser,
            updateWorkspaces: setWorkspaces,
            updateNavMain: setNavMain,
            updateProjects: setProjects,
            updateBreadcrumbList: setBreadcrumbList,
            updateHeaderAction: setHeaderAction,
        }),
        [user, workspaces, navMain, projects, breadcrumbList, headerAction],
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
                defaultOpen={true}
            >
                <AppSidebar
                    variant="inset"
                    workspaces={workspaces}
                    navMain={navMain}
                    projects={projects}
                    navigationUserItems={props.userCardItems}
                    user={user}
                />
                <SidebarInset>
                    <SiteHeader items={breadcrumbList} action={headerAction} />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </DashboardContext.Provider>
    );
}

export function useDashboard02() {
    const context = useContext(DashboardContext);

    if (context === undefined) {
        throw new Error('useDashboard must be used within an DashboardProvider');
    }

    return context;
}
