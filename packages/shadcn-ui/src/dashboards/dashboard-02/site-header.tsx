import { memo } from 'react';
import { Fragment } from 'react/jsx-runtime';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '../../components/breadcrumb';
import { Separator } from '../../components/separator';
import { SidebarTrigger } from './sidebar';
import { SiteHeaderProps } from './types';
import Link from 'next/link';

export const SiteHeader = memo(function SiteHeader({ items, action }: SiteHeaderProps) {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {items.map((item, i) => {
                            const isLast = i + 1 === items.length;

                            if (!isLast) {
                                return (
                                    <Fragment key={i}>
                                        <BreadcrumbItem className="hidden md:block">
                                            {item.url ? (
                                                <BreadcrumbLink asChild className="cursor-pointer">
                                                    <Link className="cursor-pointer" href={item.url}>
                                                        {item.name}
                                                    </Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <span>{item.name}</span>
                                            )}
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                    </Fragment>
                                );
                            }

                            return (
                                <BreadcrumbItem key={i}>
                                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
                {action && <div className="ml-auto">{action}</div>}
            </div>
        </header>
    );
});
