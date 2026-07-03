'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@repo/shadcn-ui/components/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from './sidebar';
import { NavMainItem, NavMainProps } from './types';

export function NavMain({ items, label = 'Platform' }: NavMainProps) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.items && item.items.length > 0 ? (
                        <CollapsibleNavItem key={item.id} item={item} />
                    ) : (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                <Link href={item.url}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function CollapsibleNavItem({ item }: { item: NavMainItem }) {
    return (
        <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                                <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
