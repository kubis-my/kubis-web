'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '../../components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './sidebar';
import { Workspace, WorkspaceSwitcherProps } from './types';
import KubisSvg from '../../custom-components/kubis-svg';

export function WorkspaceSwitcher({ workspaces, cta, label = 'Workspaces' }: WorkspaceSwitcherProps) {
    const { isMobile } = useSidebar();
    const pathname = usePathname();
    const router = useRouter();
    const [selectedWorkspace, setSelectedWorkspace] = React.useState(workspaces[0]);

    const routeActiveWorkspace = workspaces.find(
        (workspace) =>
            workspace.url &&
            (pathname === workspace.url || pathname.startsWith(`${workspace.url}/`)),
    );

    const activeWorkspace = routeActiveWorkspace ?? selectedWorkspace ?? workspaces[0];

    // Adds ⌘1-⌘9 shortcuts to jump to a workspace, matching each item's displayed index.
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!(event.metaKey || event.ctrlKey)) return;

            const workspace = workspaces[Number(event.key) - 1];
            if (!workspace) return;

            event.preventDefault();
            if (workspace.url) {
                router.push(workspace.url);
            } else {
                setSelectedWorkspace(workspace);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [workspaces, router]);

    if (!activeWorkspace) {
        return null;
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
                        {workspaces.map((workspace, index) => (
                            <WorkspaceItem
                                key={workspace.id}
                                workspace={workspace}
                                index={index}
                                isActive={workspace.id === activeWorkspace.id}
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
    index: number;
    isActive: boolean;
    onSelect: (workspace: Workspace) => void;
};

function WorkspaceItem({ workspace, index, isActive, onSelect }: WorkspaceItemProps) {
    const content = (
        <>
            <div className="flex size-6 items-center justify-center rounded-md border">
                <workspace.logo className="size-3.5 shrink-0" />
            </div>
            <span className="truncate">{workspace.name}</span>
            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
        </>
    );

    const itemClassName = `gap-2 p-2 ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border' : ''}`;

    if (workspace.url) {
        return (
            <DropdownMenuItem asChild className={itemClassName}>
                <Link href={workspace.url}>{content}</Link>
            </DropdownMenuItem>
        );
    }

    return (
        <DropdownMenuItem onClick={() => onSelect(workspace)} className={itemClassName}>
            {content}
        </DropdownMenuItem>
    );
}
