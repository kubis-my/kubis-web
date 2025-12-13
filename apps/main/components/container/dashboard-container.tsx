"use client";

import { ROUTE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { useAuth } from "@/shadcn/providers/auth-provider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardContainer({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { authUser } = useAuth();
    const { updateUser, updateNavigationList } = useDashboard01();
    const currentPathname = usePathname();

    useEffect(() => {
        if (!authUser) {
            updateUser(undefined)
        } else {
            updateUser({
                name: authUser.nickname!,
                email: authUser.credential?.email || "",
                avatar: authUser.profilePicture || "",
                avatarFallbackText: authUser.nickname!.at(0)?.toUpperCase() ?? ""
            })
        }
    }, [authUser, updateUser])

    useEffect(() => {
        updateNavigationList(cur => cur.map(item => ({
            ...item,
            items: item.items.map(subItem => ({
                ...subItem,
                isActive: subItem.url === ROUTE.MY_ACCOUNT.HOME
                    ? currentPathname === subItem.url
                    : currentPathname.startsWith(subItem.url)
            }))
        })))
    }, [currentPathname, updateNavigationList])

    return children
}
