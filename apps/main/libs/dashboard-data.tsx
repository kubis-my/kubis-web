'use client';

import { NavigationItem, NavUserItem } from '@/shadcn/dashboards/dashboard-01/types';
import {
    IconHome,
    IconBuilding,
    IconLogout,
    IconDeviceDesktopCheck,
    IconSettings,
    IconHelp,
    IconUserPlus,
} from '@tabler/icons-react';
import { ROUTE } from './constants';
import { authClient } from '@repo/commons/lib/auth-client';
import { getToken, clearAllTokens, REFRESH_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';
import { openSettingsDialog } from '../components/pages/settings/setting-dialog';

export const APP_NAME = 'My Account';

export const navigationList: NavigationItem[] = [
    {
        id: 'app',
        items: [
            {
                id: 'app-home',
                title: 'Home',
                url: ROUTE.MY_ACCOUNT.HOME,
                icon: <IconHome />,
                isActive: false,
            },
            {
                id: 'app-company',
                title: 'Companies',
                url: ROUTE.MY_ACCOUNT.COMPANY,
                icon: <IconBuilding />,
                isActive: true,
            },
            {
                id: 'app-invitation',
                title: 'Invitations',
                url: ROUTE.MY_ACCOUNT.INVITATION,
                icon: <IconUserPlus />,
                isActive: false,
            },
            {
                id: 'app-item',
                title: 'Your Devices',
                url: ROUTE.MY_ACCOUNT.YOUR_DEVICE,
                icon: <IconDeviceDesktopCheck />,
                isActive: false,
            },
        ],
    },
];

export const navigationUserItemList: NavUserItem[] = [
    {
        id: 'Settings',
        name: 'Settings',
        icon: <IconSettings />,
        async action(e) {
            openSettingsDialog();
        },
    },
    {
        id: 'help',
        name: 'Get Help',
        icon: <IconHelp />,
        async action(e) {
            window.location.href = 'mailto:zarkashi93@yahoo.com';
        },
    },
    {
        id: 'Log out',
        name: 'Log out',
        icon: <IconLogout />,
        separator: true,
        async action(e) {
            try {
                const refreshToken = getToken(REFRESH_TOKEN_KEY);
                if (refreshToken) {
                    await authClient.signOut({ refreshToken });
                }
            } finally {
                clearAllTokens();
                window.location.href = '/';
            }
        },
    },
];
