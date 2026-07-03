'use client';

import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects';
import { NavUser } from './nav-user';
import { WorkspaceSwitcher } from './workspace-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from './sidebar';
import { AppSidebarProps } from './types';

export function AppSidebar({
    workspaces,
    navMain,
    projects,
    user,
    navigationUserItems,
    ...props
}: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <WorkspaceSwitcher workspaces={workspaces} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
                <NavProjects projects={projects} />
            </SidebarContent>
            {user && (
                <SidebarFooter>
                    <NavUser items={navigationUserItems} user={user} />
                </SidebarFooter>
            )}
            <SidebarRail />
        </Sidebar>
    );
}
