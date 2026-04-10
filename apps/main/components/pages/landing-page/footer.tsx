'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/shadcn-ui/lib/utils';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Explore Apps', href: '/explore-apps' },
    { label: 'My Account', href: '/my-account' },
];

export default function Footer() {
    const pathname = usePathname();

    return (
        <footer className="border-t border-gray-200 bg-[#ecf0f1] dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Kubis. All rights reserved.
                    </p>
                    <nav className="flex items-center gap-6">
                        {NAV_LINKS.map(({ label, href }) => {
                            const isActive =
                                href === '/' ? pathname === '/' : pathname.startsWith(href);

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'text-sm transition-colors',
                                        isActive
                                            ? 'font-medium text-gray-900 dark:text-white'
                                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                                    )}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
