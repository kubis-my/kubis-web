'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMenu2 } from '@tabler/icons-react';
import { Button } from '@repo/shadcn-ui/components/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@repo/shadcn-ui/components/sheet';
import { SSO_APP_BASE_URL } from '@repo/commons/constant/base';
import { getInitials } from '@repo/commons/utils/initials';
import { scrollToSection } from '@repo/commons/utils/dom';
import { useAuth } from '@repo/shadcn-ui/providers/auth-provider';

const NAV_LINKS = [
    { label: 'Ecosystem', href: '/#ecosystem' },
    { label: 'Why KUBIS', href: '/#why' },
    { label: 'Founder', href: '/author' },
    { label: 'Explore Apps', href: '/explore-apps' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { isAuthenticated, authUser } = useAuth();

    const initials = getInitials(
        authUser?.displayName ||
            `${authUser?.firstName ?? ''} ${authUser?.lastName ?? ''}`.trim() ||
            authUser?.nickname,
    );

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-[#ecf0f1]/80 backdrop-blur-md dark:border-gray-800/70 dark:bg-gray-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="KUBIS" width={32} height={32} className="h-8 w-8" />
                    <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                        KUBIS
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={(e) => {
                                if (href.startsWith('/#') && pathname === '/') {
                                    scrollToSection(e, href.slice(2));
                                }
                            }}
                            className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <Link href="/my-account" aria-label="My Account">
                            <div className="relative h-8 w-8 rounded-full bg-linear-to-br from-[#4CAF50] to-emerald-600 p-0.5">
                                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#ecf0f1] dark:bg-gray-950">
                                    {authUser?.profilePicture ? (
                                        <Image
                                            src={authUser.profilePicture}
                                            alt={authUser.displayName ?? 'Profile'}
                                            width={32}
                                            height={32}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-bold text-[#4CAF50]">
                                            {initials}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Button
                            size="sm"
                            asChild
                            className="hidden bg-[#4CAF50] hover:bg-[#43A047] sm:inline-flex"
                        >
                            <Link href={`${SSO_APP_BASE_URL}/sign-in`}>Sign In</Link>
                        </Button>
                    )}

                    {/* Mobile menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Open menu"
                            >
                                <IconMenu2 className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-3/4 sm:max-w-sm">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
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
                                </SheetTitle>
                            </SheetHeader>

                            <nav className="flex flex-col gap-1 px-4">
                                {NAV_LINKS.map(({ label, href }) => (
                                    <SheetClose asChild key={href}>
                                        <Link
                                            href={href}
                                            onClick={(e) => {
                                                if (href.startsWith('/#') && pathname === '/') {
                                                    scrollToSection(e, href.slice(2));
                                                }
                                            }}
                                            className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-[#4CAF50]/10 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            {label}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </nav>

                            {!isAuthenticated && (
                                <div className="mt-auto px-4 pb-6">
                                    <SheetClose asChild>
                                        <Button
                                            asChild
                                            className="w-full bg-[#4CAF50] hover:bg-[#43A047]"
                                        >
                                            <Link href={`${SSO_APP_BASE_URL}/sign-in`}>
                                                Sign In
                                            </Link>
                                        </Button>
                                    </SheetClose>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
