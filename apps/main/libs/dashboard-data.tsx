'use client';

import { NavigationItem, NavUserItem } from '@/shadcn/dashboards/dashboard-01/types';
import {
    IconCreditCard,
    IconHome,
    IconBuilding,
    IconLogout,
    IconNotification,
    IconIdBadge2,
    IconDeviceDesktopCheck,
    IconSettings,
    IconHelp,
    IconSearch,
    IconUserPlus,
} from '@tabler/icons-react';
import { getCsrfHeaders } from '@repo/commons/utils/csrf-client';
import { toast } from 'sonner';
import { ROUTE } from './constants';
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
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: getCsrfHeaders(),
                credentials: 'include',
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                toast.error('Failed to sign out. Please try again.');
            }
        },
    },
];
