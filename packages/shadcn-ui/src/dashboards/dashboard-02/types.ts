import type { Sidebar } from './sidebar';
import type { LucideIcon } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

export type DashboardContextType = {
    user: User | undefined;
    workspaces: Workspace[];
    workspacesLoading: boolean;
    navMain: NavMainItem[];
    breadcrumbList: BreadcrumbItem[];
    headerAction: React.ReactNode;
    showWorkspaceSwitcher: boolean;
    updateUser: Dispatch<SetStateAction<User | undefined>>;
    updateWorkspaces: Dispatch<SetStateAction<Workspace[]>>;
    updateWorkspacesLoading: Dispatch<SetStateAction<boolean>>;
    updateNavMain: Dispatch<SetStateAction<NavMainItem[]>>;
    updateBreadcrumbList: Dispatch<SetStateAction<BreadcrumbItem[]>>;
    updateHeaderAction: Dispatch<SetStateAction<React.ReactNode>>;
    updateShowWorkspaceSwitcher: Dispatch<SetStateAction<boolean>>;
};

// Generic switcher entity — represents a team, company, project, etc.
export type Workspace = {
    id: string;
    name: string;
    logo: LucideIcon;
    subtitle: string;
    // When set, the switcher item navigates here and derives its active state from the route.
    url?: string;
};

export type NavMainItem = {
    id: string;
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    badge?: React.ReactNode;
    group?: string;
    items?: {
        id: string;
        title: string;
        url: string;
    }[];
};

export type DashboardProviderProps = {
    workspaces: Workspace[];
    navMain: NavMainItem[];
    userCardItems: NavUserItem[];
    user?: User;
    appName?: string;
    switcherCta?: React.ReactNode;
    switcherLabel?: string;
    children: React.ReactNode;
};

export type AppSidebarProps = {
    workspaces: Workspace[];
    workspacesLoading?: boolean;
    navMain: NavMainItem[];
    navMainLabel?: string;
    user?: User;
    appName?: string;
    navigationUserItems: NavUserItem[];
    switcherCta?: React.ReactNode;
    switcherLabel?: string;
    showWorkspaceSwitcher?: boolean;
} & React.ComponentProps<typeof Sidebar>;

export type WorkspaceSwitcherProps = {
    workspaces: Workspace[];
    loading?: boolean;
    cta?: React.ReactNode;
    label?: string;
};

export type NavMainProps = {
    items: NavMainItem[];
    label?: string;
};

export type NavUserItem = {
    id: string;
    name: string;
    separator?: boolean;
    icon?: React.ReactNode;
    action: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => Promise<void>;
};

export type User = {
    name: string;
    email: string;
    avatar: string;
    avatarFallbackText: string;
};

export type NavUserProps = {
    items: NavUserItem[];
    user: User;
};

export type BreadcrumbItem = {
    name: string;
    url?: string;
};

export type SiteHeaderProps = {
    items: BreadcrumbItem[];
    action?: React.ReactNode;
};
