'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/dropdown-menu';
import { Skeleton } from '../../components/skeleton';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './sidebar';
import { Workspace, WorkspaceSwitcherProps } from './types';
import KubisSvg from '../../custom-components/kubis-svg';

function WorkspaceSwitcherSkeleton() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex h-12 w-full items-center gap-2 rounded-md p-2">
                    <Skeleton className="size-8 shrink-0 rounded-lg" />
                    <div className="grid flex-1 gap-1.5">
                        <Skeleton className="h-3.5 w-3/5" />
                        <Skeleton className="h-3 w-2/5" />
                    </div>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export function WorkspaceSwitcher({
    workspaces,
    loading = false,
    cta,
    label = 'Workspaces',
}: WorkspaceSwitcherProps) {
    const { isMobile } = useSidebar();
    const pathname = usePathname();
    const [selectedWorkspace, setSelectedWorkspace] = React.useState(workspaces[0]);

    const routeActiveWorkspace = workspaces.find(
        (workspace) =>
            workspace.url &&
            (pathname === workspace.url || pathname.startsWith(`${workspace.url}/`)),
    );

    const activeWorkspace = routeActiveWorkspace ?? selectedWorkspace ?? workspaces[0];

    if (!activeWorkspace) {
        return loading ? <WorkspaceSwitcherSkeleton /> : null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg border">
                                <KubisSvg className="size-5!" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {activeWorkspace.name}
                                </span>
                                <span className="truncate text-xs">
                                    {activeWorkspace.subtitle}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            {label}
                        </DropdownMenuLabel>
                        {workspaces
                            .filter((workspace) => workspace.id !== activeWorkspace.id)
                            .map((workspace) => (
                                <WorkspaceItem
                                    key={workspace.id}
                                    workspace={workspace}
                                    onSelect={setSelectedWorkspace}
                                />
                            ))}
                        {cta && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="gap-2 p-2">
                                    {cta}
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

type WorkspaceItemProps = {
    workspace: Workspace;
    onSelect: (workspace: Workspace) => void;
};

function WorkspaceItem({ workspace, onSelect }: WorkspaceItemProps) {
    const content = (
        <>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border">
                <workspace.logo className="size-3.5 shrink-0" />
            </div>
            <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
        </>
    );

    if (workspace.url) {
        return (
            <DropdownMenuItem asChild className="gap-2 p-2">
                <Link href={workspace.url}>{content}</Link>
            </DropdownMenuItem>
        );
    }

    return (
        <DropdownMenuItem onClick={() => onSelect(workspace)} className="gap-2 p-2">
            {content}
        </DropdownMenuItem>
    );
}
