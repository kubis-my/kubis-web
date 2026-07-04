'use client';

import Link from 'next/link';
import { NavMainItem, NavUserItem } from '@/shadcn/dashboards/dashboard-02/types';
import {
    IconLogout,
    IconHelp,
    IconUser,
    IconApps,
} from '@tabler/icons-react';
import {
    FileText,
    Flag,
    Layers,
    LayoutGrid,
    MessageSquare,
    Receipt,
    Settings,
} from 'lucide-react';
import { ROUTE } from './constants';
import { env } from '@repo/commons/constant/env';
import { authClient } from '@repo/commons/lib/auth-client';
import { getToken, clearAllTokens, REFRESH_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';
import { formatCount } from '@repo/commons/utils/number';

export function getProjectNavMain(projectId: string, unreadCount = 0): NavMainItem[] {
    const threadsUnreadLabel = formatCount(unreadCount);

    return [
        {
            id: 'project-overview',
            title: 'Overview',
            url: ROUTE.FORGE.PROJECT_DETAIL(projectId),
            icon: FileText,
            group: 'Project',
            isActive: false,
        },
        {
            id: 'project-milestones',
            title: 'Milestones',
            url: ROUTE.FORGE.PROJECT_MILESTONES(projectId),
            icon: Flag,
            group: 'Project',
            isActive: false,
        },
        {
            id: 'project-threads',
            title: 'Threads',
            url: ROUTE.FORGE.PROJECT_THREADS(projectId),
            icon: MessageSquare,
            group: 'Project',
            badge:
                unreadCount > 0 ? (
                    <span className="bg-primary text-primary-foreground flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] leading-none font-semibold tabular-nums shadow-sm group-data-[collapsible=icon]:opacity-0">
                        {threadsUnreadLabel}
                        <span className="sr-only">unread threads</span>
                    </span>
                ) : undefined,
            isActive: false,
        },
        {
            id: 'project-context',
            title: 'Context',
            url: ROUTE.FORGE.PROJECT_CONTEXT(projectId),
            icon: Layers,
            group: 'Manage',
            isActive: false,
        },
        {
            id: 'project-billing',
            title: 'Billing',
            url: ROUTE.FORGE.PROJECT_BILLING(projectId),
            icon: Receipt,
            group: 'Manage',
            isActive: false,
        },
        {
            id: 'project-settings',
            title: 'Settings',
            url: ROUTE.FORGE.PROJECT_SETTINGS(projectId),
            icon: Settings,
            group: 'Manage',
            isActive: false,
        },
    ];
}

export function getProjectsNavMain(): NavMainItem[] {
    return [
        {
            id: 'projects',
            title: 'Projects',
            url: ROUTE.FORGE.HOME,
            icon: LayoutGrid,
            isActive: false,
        },
    ];
}

export const showAllProjectsCta = (
    <Link href={ROUTE.FORGE.HOME} className="text-muted-foreground flex w-full items-center gap-2">
        <LayoutGrid className="size-4 shrink-0" />
        <span>Show all projects</span>
    </Link>
);

export const navigationUserItemList: NavUserItem[] = [
    {
        id: 'explore-apps',
        name: 'Explore apps',
        icon: <IconApps />,
        async action() {
            window.open(`${env.NEXT_PUBLIC_MAIN_APP_BASE_URL}/explore-apps`, '_blank');
        },
    },
    {
        id: 'my-account',
        name: 'My account',
        icon: <IconUser />,
        async action() {
            window.open(`${env.NEXT_PUBLIC_MAIN_APP_BASE_URL}/my-account`, '_blank');
        },
    },
    {
        id: 'help',
        name: 'Get Help',
        icon: <IconHelp />,
        async action() { },
    },
    {
        id: 'log-out',
        name: 'Log out',
        icon: <IconLogout />,
        separator: true,
        async action() {
            try {
                const refreshToken = getToken(REFRESH_TOKEN_KEY);
                if (refreshToken) {
                    await authClient.signOut({ refreshToken });
                }
            } finally {
                clearAllTokens();
                window.location.href = env.NEXT_PUBLIC_MAIN_APP_BASE_URL;
            }
        },
    },
];
