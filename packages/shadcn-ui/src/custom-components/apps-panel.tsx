'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconApps, IconArrowUpRight, IconArrowRight } from '@tabler/icons-react';
import { Badge } from '../components/badge';
import { cn } from '../lib/utils';
import { FORGE_APP_BASE_URL, MAIN_APP_BASE_URL, OPS_APP_BASE_URL } from '@repo/commons/constant/base';
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '../components/popover';
import { Button } from '../components/button';
import { Separator } from '../components/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/tooltip';

type KubisApp = {
    name: string;
    initial: string;
    category: string;
    status: string;
    href: string;
    accent: string;
    enabled: boolean;
};

const APPS: KubisApp[] = [
    {
        name: 'My Account',
        initial: 'A',
        category: 'Account & profile settings',
        status: 'Available',
        href: `${MAIN_APP_BASE_URL}/my-account`,
        accent: '#F59E0B',
        enabled: true,
    },
    {
        name: 'Forge',
        initial: 'F',
        category: 'Custom business systems',
        status: 'Available',
        href: `${FORGE_APP_BASE_URL}/projects`,
        accent: '#4CAF50',
        enabled: true,
    },
    {
        name: 'Ops',
        initial: 'O',
        category: 'Order-to-production workflow',
        status: 'In development',
        href: OPS_APP_BASE_URL,
        accent: '#6366f1',
        enabled: false,
    },
];

function useIsActiveApp(href: string) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(new URL(href, window.location.origin).origin === window.location.origin);
    }, [href]);

    return isActive;
}

function AppTile({ app }: { app: KubisApp }) {
    const isActive = useIsActiveApp(app.href);

    const initial = (
        <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: app.accent }}
            aria-hidden
        >
            {app.initial}
        </span>
    );

    const meta = (
        <span className="flex min-w-0 flex-col">
            <span className="flex items-center gap-2">
                <span className="text-foreground truncate text-sm font-semibold">{app.name}</span>
                {app.status !== "Available" && <Badge
                    variant={app.enabled ? 'secondary' : 'outline'}
                    className={cn('shrink-0', !app.enabled && 'text-muted-foreground')}
                >
                    {app.status}
                </Badge>}
            </span>
            <span className="text-muted-foreground truncate text-xs">{app.category}</span>
        </span>
    );

    if (!app.enabled || !app.href) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        aria-disabled
                        data-active={isActive}
                        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2 opacity-60 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    >
                        {initial}
                        {meta}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left">Coming soon</TooltipContent>
            </Tooltip>
        );
    }

    if (isActive) {
        return (
            <div className="bg-accent text-accent-foreground flex cursor-default items-center gap-3 rounded-lg px-2.5 py-2">
                {initial}
                {meta}
            </div>
        );
    }

    return (
        <Link
            href={app.href}
            rel="noopener noreferrer"
            className="hover:bg-accent group focus-visible:ring-ring/50 flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 outline-none transition-colors focus-visible:ring-[3px]"
        >
            {initial}
            {meta}
            <span className="sr-only"> (opens in new tab)</span>
            <IconArrowUpRight className="text-muted-foreground ml-auto size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
    );
}

export function AppsPanel() {
    return (
        <Popover>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open Kubis apps"
                            className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground size-7"
                        >
                            <IconApps className="size-4" />
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Switch apps</TooltipContent>
            </Tooltip>
            <PopoverContent align="end" className="w-[350px] p-0">
                <PopoverHeader className="gap-0.5 px-4 pt-4 pb-3">
                    <PopoverTitle>Kubis apps</PopoverTitle>
                    <PopoverDescription>Switch between apps in the ecosystem.</PopoverDescription>
                </PopoverHeader>
                <Separator />
                <div className="flex flex-col gap-0.5 p-2">
                    {APPS.map((app) => (
                        <AppTile key={app.name} app={app} />
                    ))}
                </div>
                <Separator />
                <Link
                    href={`${MAIN_APP_BASE_URL}/explore-apps`}
                    rel="noopener noreferrer"
                    className="hover:bg-accent group focus-visible:ring-ring/50 flex cursor-pointer items-center justify-between gap-2 px-4 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px]"
                >
                    View all apps
                    <IconArrowRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </PopoverContent>
        </Popover>
    );
}
