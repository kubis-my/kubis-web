'use client';

import { NavigationItem, NavUserItem } from '@/shadcn/dashboards/dashboard-01/types';
import { IconHome, IconLogout, IconHelp, IconUser, IconFolderOpen } from '@tabler/icons-react';
import { getCsrfHeaders } from '@repo/commons/utils/csrf-client';
import { toast } from 'sonner';
import { ROUTE } from './constants';
import { env } from '@repo/commons/constant/env';

export const APP_NAME = 'Forge Console';

export function getNavigationList(companyIndex: number): NavigationItem[] {
    return [
        {
            id: 'app',
            items: [
                {
                    id: 'app-home',
                    title: 'Home',
                    url: ROUTE.FORGE.HOME(companyIndex),
                    icon: <IconHome />,
                    isActive: false,
                },
                {
                    id: 'app-projects',
                    title: 'Projects',
                    url: ROUTE.FORGE.PROJECTS(companyIndex),
                    icon: <IconFolderOpen />,
                    isActive: false,
                },
            ],
        },
    ];
}

export const navigationUserItemList: NavUserItem[] = [
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
        async action() {},
    },
    {
        id: 'log-out',
        name: 'Log out',
        icon: <IconLogout />,
        separator: true,
        async action() {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: getCsrfHeaders(),
                credentials: 'include',
            });

            if (response.ok) {
                window.location.href = env.NEXT_PUBLIC_MAIN_APP_BASE_URL;
            } else {
                toast.error('Failed to sign out. Please try again.');
            }
        },
    },
];
