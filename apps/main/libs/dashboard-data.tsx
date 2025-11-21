"use client";

import { NavigationItem, NavUserItem } from "@/shadcn/dashboards/dashboard-01/types"
import { IconCreditCard, IconHome, IconBuilding, IconLogout, IconNotification, IconIdBadge2, IconDeviceDesktopCheck, IconSettings, IconHelp, IconSearch, IconUserPlus } from "@tabler/icons-react"
import { ROUTE } from "./constants";

export const APP_NAME = "My Account";

export const navigationList: NavigationItem[] = [
    {
        id: "app",
        items: [
            {
                id: "app-home",
                title: "Home",
                url: ROUTE.MY_ACCOUNT.HOME,
                icon: <IconHome />,
                isActive: false
            },
            {
                id: "app-profile",
                title: "Profile",
                url: ROUTE.MY_ACCOUNT.PROFILE,
                icon: <IconIdBadge2 />,
                isActive: false
            },
            {
                id: "app-company",
                title: "Companies",
                url: ROUTE.MY_ACCOUNT.COMPANY,
                icon: <IconBuilding />,
                isActive: true
            },
            {
                id: "app-invitation",
                title: "Invitations",
                url: ROUTE.MY_ACCOUNT.INVITATION,
                icon: <IconUserPlus />,
                isActive: false
            },
            {
                id: "app-item",
                title: "Your Devices",
                url: ROUTE.MY_ACCOUNT.YOUR_DEVICE,
                icon: <IconDeviceDesktopCheck />,
                isActive: false
            },
        ]
    },
    {
        id: "footer",
        props: {
            className: "mt-auto"
        },
        items: [
            {
                id: "footer-setting",
                title: "Settings",
                url: "#",
                icon: <IconSettings />,
                isActive: false
            },
            {
                id: "footer-help",
                title: "Get Help",
                url: "#",
                icon: <IconHelp />,
                isActive: false
            },
            {
                id: "footer-search",
                title: "Search",
                url: "#",
                icon: <IconSearch />,
                isActive: false
            },
        ]
    }
];

export const navigationUserItemList: NavUserItem[] = [
    {
        id: "Billing",
        name: "Billing",
        icon: <IconCreditCard />,
        async action(e) {

        },
    },
    {
        id: "Notifications",
        name: "Notifications",
        icon: <IconNotification />,
        async action(e) {

        },
    },
    {
        id: "Log out",
        name: "Log out",
        icon: <IconLogout />,
        separator: true,
        async action(e) {

        },
    },
]