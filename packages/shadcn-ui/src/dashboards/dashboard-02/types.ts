import type { Sidebar } from './sidebar';
import type { LucideIcon } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

export type DashboardContextType = {
    user: User | undefined;
    workspaces: Workspace[];
    navMain: NavMainItem[];
    projects: Project[];
    breadcrumbList: BreadcrumbItem[];
    headerAction: React.ReactNode;
    updateUser: Dispatch<SetStateAction<User | undefined>>;
    updateWorkspaces: Dispatch<SetStateAction<Workspace[]>>;
    updateNavMain: Dispatch<SetStateAction<NavMainItem[]>>;
    updateProjects: Dispatch<SetStateAction<Project[]>>;
    updateBreadcrumbList: Dispatch<SetStateAction<BreadcrumbItem[]>>;
    updateHeaderAction: Dispatch<SetStateAction<React.ReactNode>>;
};

// Generic switcher entity — represents a team, company, project, etc.
export type Workspace = {
    id: string;
    name: string;
    logo: LucideIcon;
    subtitle: string;
};

export type NavMainItem = {
    id: string;
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        id: string;
        title: string;
        url: string;
    }[];
};

export type Project = {
    id: string;
    name: string;
    url: string;
    icon: LucideIcon;
};

export type DashboardProviderProps = {
    workspaces: Workspace[];
    navMain: NavMainItem[];
    projects: Project[];
    userCardItems: NavUserItem[];
    user?: User;
    children: React.ReactNode;
};

export type AppSidebarProps = {
    workspaces: Workspace[];
    navMain: NavMainItem[];
    projects: Project[];
    user?: User;
    navigationUserItems: NavUserItem[];
} & React.ComponentProps<typeof Sidebar>;

export type WorkspaceSwitcherProps = {
    workspaces: Workspace[];
    cta?: React.ReactNode;
};

export type NavMainProps = {
    items: NavMainItem[];
};

export type NavProjectsProps = {
    projects: Project[];
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
