'use client';

import { NavigationItem, NavUserItem } from '@/shadcn/dashboards/dashboard-01/types';
import {
    IconHome,
    IconLogout,
    IconHelp,
    IconPackage,
    IconReplace,
    IconUser,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { ROUTE } from './constants';
import { env } from '@repo/commons/constant/env';
import { authClient } from '@repo/commons/lib/auth-client';
import { getToken, clearAllTokens, REFRESH_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';
import { openSwitchCompanyDialog } from '../components/pages/switch-company/switch-company-dialog';

export const APP_NAME = 'Process Management';

export function getNavigationList(companyIndex: number): NavigationItem[] {
    return [
        {
            id: 'app',
            items: [
                {
                    id: 'app-home',
                    title: 'Home',
                    url: ROUTE.OPS.HOME(companyIndex),
                    icon: <IconHome />,
                    isActive: false,
                },
                {
                    id: 'app-catalog',
                    title: 'Catalog',
                    url: ROUTE.OPS.CATALOG(companyIndex),
                    icon: <IconPackage />,
                    isActive: false,
                },
            ],
        },
    ];
}

export const navigationUserItemList: NavUserItem[] = [
    {
        id: 'switch-company',
        name: 'Switch company',
        icon: <IconReplace />,
        async action() {
            openSwitchCompanyDialog();
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
        async action() {},
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
