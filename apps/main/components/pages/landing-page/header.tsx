'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@repo/shadcn-ui/components/button';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@repo/shadcn-ui/components/avatar';
import { useAuth } from '@repo/shadcn-ui/providers/auth-provider';

// TODO: replace with actual data later
const serviceCategories = [
    {
        title: 'Productivity',
        services: [
            { name: 'Mail', href: '/mail' },
            { name: 'Calendar', href: '/calendar' },
            { name: 'Drive', href: '/drive' },
            { name: 'Docs', href: '/docs' },
            { name: 'Sheets', href: '/sheets' },
            { name: 'Slides', href: '/slides' },
        ],
    },
    {
        title: 'Communication',
        services: [
            { name: 'Chat', href: '/chat' },
            { name: 'Meet', href: '/meet' },
            { name: 'Video Calls', href: '/video' },
            { name: 'Groups', href: '/groups' },
        ],
    },
    {
        title: 'Business',
        services: [
            { name: 'Business Hub', href: '/business' },
            { name: 'Analytics', href: '/analytics' },
            { name: 'CRM', href: '/crm' },
            { name: 'Projects', href: '/projects' },
            { name: 'Invoicing', href: '/invoicing' },
        ],
    },
    {
        title: 'Tools',
        services: [
            { name: 'Storage', href: '/storage' },
            { name: 'Photos', href: '/photos' },
            { name: 'Maps', href: '/maps' },
            { name: 'Search', href: '/search' },
            { name: 'News', href: '/news' },
        ],
    },
];

export default function Header() {
    const [showApps, setShowApps] = useState(false);
    const auth = useAuth();

    const getAvatarFallback = (): string => {
        return (
            [
                auth.authUser?.displayName,
                auth.authUser?.nickname,
                auth.authUser?.firstName,
                auth.authUser?.lastName,
            ]
                .filter(Boolean)[0]
                ?.at(0) ?? 'K'
        );
    };

    return (
        <>
            <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/logo.png"
                                alt="KUBIS Logo"
                                width={32}
                                height={32}
                                className="h-8 w-8"
                            />
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                KUBIS
                            </span>
                        </Link>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">
                            {/* All Leaf Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowApps(!showApps)}
                                className="flex items-center gap-1"
                                aria-label="All Leaf"
                            >
                                <span className="text-sm">All Leaf</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                        showApps ? 'rotate-180' : ''
                                    }`}
                                />
                            </Button>

                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/my-account">Account</Link>
                            </Button>

                            <Avatar className="h-9 w-9 cursor-pointer">
                                <AvatarFallback className="bg-gradient-to-br from-[#66BB6A] to-[#4CAF50] font-medium text-white uppercase">
                                    {getAvatarFallback()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </header>
            {showApps && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowApps(false)} />

                    {/* Mega Menu Dropdown */}
                    <div className="fixed top-16 right-0 left-0 z-50 border-b border-gray-200 bg-gray-50 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                                {serviceCategories.map((category, index) => (
                                    <div key={index}>
                                        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                                            {category.title}
                                        </h3>
                                        <ul className="space-y-3">
                                            {category.services.map((service, serviceIndex) => (
                                                <li key={serviceIndex}>
                                                    <Link
                                                        href={service.href}
                                                        onClick={() => setShowApps(false)}
                                                        className="block text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                                    >
                                                        {service.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
