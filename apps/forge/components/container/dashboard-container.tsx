'use client';

import { getNavigationList } from '@/root/libs/dashboard-data';
import { ROUTE } from '@/root/libs/constants';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Credential } from '@repo/commons/types/account-service-schema.type';

export default function DashboardContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const currentPathname = usePathname();
    const params = useParams();

    const { authUser } = useAuth();
    const { updateUser, updateNavigationList } = useDashboard01();

    const companyIndex = Number(params?.companyIndex ?? 0);

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
        const homeUrl = ROUTE.FORGE.HOME(companyIndex);

        updateNavigationList(() =>
            getNavigationList(companyIndex).map((group) => ({
                ...group,
                items: group.items.map((item) => ({
                    ...item,
                    isActive:
                        item.url === homeUrl
                            ? currentPathname === item.url
                            : currentPathname.startsWith(item.url),
                })),
            })),
        );
    }, [companyIndex, currentPathname, updateNavigationList]);

    return children;
}
