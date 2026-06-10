'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { scrollToSection } from '@repo/commons/utils/dom';
import { cn } from '@repo/shadcn-ui/lib/utils';

const COLUMNS = [
    {
        heading: 'Platform',
        links: [
            { label: 'Ecosystem', href: '/#ecosystem' },
            { label: 'Why KUBIS', href: '/#why' },
            { label: 'How It Works', href: '/#how-it-works' },

        ],
    },
    {
        heading: 'Applications',
        links: [
            { label: 'Explore Apps', href: '/explore-apps' },
        ],
    },
    {
        heading: 'Company',
        links: [
            { label: 'About the Founder', href: '/author' },
            { label: 'My Account', href: '/my-account' },
        ],
    },
];

export default function Footer() {
    const pathname = usePathname();

    return (
        <footer className="border-t border-gray-200 bg-[#ecf0f1] dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="KUBIS"
                                width={28}
                                height={28}
                                className="h-7 w-7"
                            />
                            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                                KUBIS
                            </span>
                        </Link>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            A modular business software ecosystem. One ecosystem. Multiple
                            purpose-built applications.
                        </p>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.heading}>
                            <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                                {col.heading}
                            </h3>
                            <ul className="mt-4 flex flex-col gap-3">
                                {col.links.map(({ label, href }) => {
                                    const isActive =
                                        href === '/'
                                            ? pathname === '/'
                                            : !href.startsWith('/#') && pathname.startsWith(href);
                                    const isHashLink = href.startsWith('/#');

                                    return (
                                        <li key={`${col.heading}-${label}`}>
                                            <Link
                                                href={href}
                                                onClick={(e) => {
                                                    if (isHashLink && pathname === '/') {
                                                        scrollToSection(e, href.slice(2));
                                                    }
                                                }}
                                                className={cn(
                                                    'text-sm transition-colors',
                                                    isActive
                                                        ? 'font-medium text-gray-900 dark:text-white'
                                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                                                )}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} KUBIS. Built by an engineer, for businesses
                        that outgrew their tools.
                    </p>
                </div>
            </div>
        </footer>
    );
}
