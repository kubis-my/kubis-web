import type { Sidebar } from "./sidebar"
import React, { Dispatch, SetStateAction } from "react";

export type DashboardContextType = {
    user: User | undefined
    navigationList: NavigationItem[]
    breadcrumbList: BreadcrumbItem[]
    headerAction: React.ReactNode
    updateUser: Dispatch<SetStateAction<User | undefined>>
    updateNavigationList: Dispatch<SetStateAction<NavigationItem[]>>
    updateBreadcrumbList: Dispatch<SetStateAction<BreadcrumbItem[]>>
    updateHeaderAction: Dispatch<SetStateAction<React.ReactNode>>
}

export type NavigationItem = {
    id: string
    props?: React.ComponentProps<"div">
    label?: string
    items: {
        id: string
        title: string
        url: string
        icon?: React.ReactNode
        actionButton?: React.ReactNode
        isActive: boolean
    }[]
}

export type NavigationProps = {
    navigation: NavigationItem[]
}

export type DashboardProviderProps = {
    appName: string
    navigations: NavigationItem[]
    userCardItems: NavUserItem[]
    user?: User
    children: React.ReactNode
}

export type AppSidebarProps = {
    appName: string
    user?: User
    navigations: NavigationItem[]
    navigationUserItems: NavUserItem[]
} & React.ComponentProps<typeof Sidebar>

export type NavUserItem = {
    id: string
    name: string
    separator?: boolean
    icon?: React.ReactNode
    action: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => Promise<void>
}

export type User = {
    name: string
    email: string
    avatar: string
    avatarFallbackText: string
}

export type NavUserProps = {
    items: NavUserItem[],
    user: User
}

export type BreadcrumbItem = {
    name: string
    url?: string
}

export type SiteHeaderProps = {
    items: BreadcrumbItem[]
    action?: React.ReactNode
}