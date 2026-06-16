'use client';

import { NavigationItem, NavUserItem } from '@/shadcn/dashboards/dashboard-01/types';
import {
    IconHome,
    IconLogout,
    IconHelp,
    IconUser,
    IconApps,
    IconFileDescription,
    IconFlag,
    IconMessages,
    IconSettings,
    IconStack,
    IconReceipt,
} from '@tabler/icons-react';
import { ROUTE } from './constants';
import { env } from '@repo/commons/constant/env';
import { authClient } from '@repo/commons/lib/auth-client';
import { getToken, clearAllTokens, REFRESH_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';

export const APP_NAME = 'Forge Console';

export function getNavigationList(): NavigationItem[] {
    return [
        {
            id: 'app',
            items: [
                {
                    id: 'app-home',
                    title: 'Home',
                    url: ROUTE.FORGE.HOME,
                    icon: <IconHome />,
                    isActive: false,
                },
            ],
        },
    ];
}

export function getProjectNavigationList(projectId: string, unreadCount = 0): NavigationItem[] {
    const threadsUnreadLabel = unreadCount > 99 ? '99+' : String(unreadCount);

    return [
        {
            id: 'app',
            items: [
                {
                    id: 'project-overview',
                    title: 'Overview',
                    url: ROUTE.FORGE.PROJECT_DETAIL(projectId),
                    icon: <IconFileDescription />,
                    isActive: false,
                },
                {
                    id: 'project-milestones',
                    title: 'Milestones',
                    url: ROUTE.FORGE.PROJECT_MILESTONES(projectId),
                    icon: <IconFlag />,
                    isActive: false,
                },
                {
                    id: 'project-threads',
                    title: 'Threads',
                    url: ROUTE.FORGE.PROJECT_THREADS(projectId),
                    icon: <IconMessages />,
                    actionButton:
                        unreadCount > 0 ? (
                            <span className="bg-primary text-primary-foreground flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] leading-none font-semibold tabular-nums shadow-sm group-data-[collapsible=icon]:opacity-0">
                                {threadsUnreadLabel}
                                <span className="sr-only">unread threads</span>
                            </span>
                        ) : null,
                    isActive: false,
                },
                {
                    id: 'project-context',
                    title: 'Context',
                    url: ROUTE.FORGE.PROJECT_CONTEXT(projectId),
                    icon: <IconStack />,
                    isActive: false,
                },
                {
                    id: 'project-billing',
                    title: 'Billing',
                    url: ROUTE.FORGE.PROJECT_BILLING(projectId),
                    icon: <IconReceipt />,
                    isActive: false,
                },
                {
                    id: 'project-settings',
                    title: 'Settings',
                    url: ROUTE.FORGE.PROJECT_SETTINGS(projectId),
                    icon: <IconSettings />,
                    isActive: false,
                },
            ],
        },
    ];
}

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
