'use client';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { WorkspaceSwitcher } from './workspace-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from './sidebar';
import { AppSidebarProps } from './types';
import KubisSvg from '../../custom-components/kubis-svg';

export function AppSidebar({
    workspaces,
    workspacesLoading,
    navMain,
    navMainLabel,
    user,
    appName,
    navigationUserItems,
    switcherCta,
    switcherLabel,
    showWorkspaceSwitcher = true,
    ...props
}: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {showWorkspaceSwitcher ? (
                    <WorkspaceSwitcher
                        workspaces={workspaces}
                        loading={workspacesLoading}
                        cta={switcherCta}
                        label={switcherLabel}
                    />
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="hover:bg-transparent hover:text-current data-[slot=sidebar-menu-button]:p-1.5!">
                                <KubisSvg className="size-5!" />
                                <span className="text-base font-semibold">{appName}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} label={navMainLabel} />
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
