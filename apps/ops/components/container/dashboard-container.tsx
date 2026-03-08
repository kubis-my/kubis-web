'use client';

import { ROUTE } from '@/root/libs/constants';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Credential } from '@repo/commons/types/auth-service-schema.type';

export default function DashboardContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const currentPathname = usePathname();

    const { authUser } = useAuth();
    const { updateUser, updateNavigationList } = useDashboard01();

    useEffect(() => {
        if (!authUser) {
            updateUser(undefined);
        } else {
            updateUser({
                name: authUser.nickname!,
                email: (authUser.credential as Credential)?.email || '',
                avatar: authUser.profilePicture || '',
                avatarFallbackText: authUser.nickname!.at(0)?.toUpperCase() ?? '',
            });
        }
    }, [authUser, updateUser]);

    useEffect(() => {
        updateNavigationList((cur) =>
            cur.map((item) => ({
                ...item,
                items: item.items.map((subItem) => ({
                    ...subItem,
                    isActive:
                        subItem.url === ROUTE.OPS.HOME
                            ? currentPathname === subItem.url
                            : currentPathname.startsWith(subItem.url),
                })),
            })),
        );
    }, [currentPathname, updateNavigationList]);

    return children;
}
