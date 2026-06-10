'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import { useAuth } from '@repo/shadcn-ui/providers/auth-provider';
import { scrollToSection } from '@repo/commons/utils/dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeroCta() {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                <Link href="/explore-apps">Explore the Ecosystem</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
                <Link
                    href={isAuthenticated ? '/my-account' : '/#how-it-works'}
                    onClick={(e) => {
                        if (!isAuthenticated && pathname === '/') {
                            scrollToSection(e, 'how-it-works');
                        }
                    }}
                >
                    {isAuthenticated ? 'Go to Account' : 'See How It Works'}
                </Link>
            </Button>
        </div>
    );
}
