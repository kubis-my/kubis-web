"use client";

import Link from 'next/link';
import React, { useState } from 'react'
import Image from "next/image";
import { Button } from '@repo/shadcn-ui/components/button';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@repo/shadcn-ui/components/avatar';
import { useAuth } from '@repo/shadcn-ui/providers/auth-provider';

// TODO: replace with actual data later
const serviceCategories = [
    {
        title: "Productivity",
        services: [
            { name: "Mail", href: "/mail" },
            { name: "Calendar", href: "/calendar" },
            { name: "Drive", href: "/drive" },
            { name: "Docs", href: "/docs" },
            { name: "Sheets", href: "/sheets" },
            { name: "Slides", href: "/slides" },
        ],
    },
    {
        title: "Communication",
        services: [
            { name: "Chat", href: "/chat" },
            { name: "Meet", href: "/meet" },
            { name: "Video Calls", href: "/video" },
            { name: "Groups", href: "/groups" },
        ],
    },
    {
        title: "Business",
        services: [
            { name: "Business Hub", href: "/business" },
            { name: "Analytics", href: "/analytics" },
            { name: "CRM", href: "/crm" },
            { name: "Projects", href: "/projects" },
            { name: "Invoicing", href: "/invoicing" },
        ],
    },
    {
        title: "Tools",
        services: [
            { name: "Storage", href: "/storage" },
            { name: "Photos", href: "/photos" },
            { name: "Maps", href: "/maps" },
            { name: "Search", href: "/search" },
            { name: "News", href: "/news" },
        ],
    }
];

export default function Header() {
    const [showApps, setShowApps] = useState(false);
    const auth = useAuth()

    const getAvatarFallback = (): string => {
        return [
            auth.authUser?.displayName,
            auth.authUser?.nickname,
            auth.authUser?.firstName,
            auth.authUser?.lastName,
        ].filter(Boolean)[0]?.at(0) ?? "K"
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/logo.png"
                                alt="KUBIS Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8"
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
                                    className={`w-4 h-4 transition-transform ${showApps ? "rotate-180" : ""
                                        }`}
                                />
                            </Button>

                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/my-account">Account</Link>
                            </Button>

                            <Avatar className="w-9 h-9 cursor-pointer">
                                <AvatarFallback className="bg-gradient-to-br from-[#66BB6A] to-[#4CAF50] text-white font-medium uppercase">
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
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowApps(false)}
                    />

                    {/* Mega Menu Dropdown */}
                    <div className="fixed left-0 right-0 top-16 z-50 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                                {serviceCategories.map((category, index) => (
                                    <div key={index}>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                            {category.title}
                                        </h3>
                                        <ul className="space-y-3">
                                            {category.services.map((service, serviceIndex) => (
                                                <li key={serviceIndex}>
                                                    <Link
                                                        href={service.href}
                                                        onClick={() => setShowApps(false)}
                                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors block"
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
    )
}
