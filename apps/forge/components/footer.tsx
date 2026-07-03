'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { scrollToSection } from '@repo/commons/utils/dom';
import KubisSvg from '@repo/shadcn-ui/custom-components/kubis-svg';
import { FORGE_CONTENT, type ForgeLocale } from '@/root/libs/i18n/forge-content';

export default function Footer() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale: ForgeLocale = searchParams.get('lang') === 'ms' ? 'ms' : 'en';
    const langParam = locale === 'ms' ? '?lang=ms' : '';
    const { footer } = FORGE_CONTENT[locale];

    return (
        <footer className="bg-gray-950">
            <div className="h-px bg-linear-to-r from-transparent via-[#4CAF50]/50 to-transparent" />

            <div className="mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
                    <div className="flex flex-col gap-4">
                        <span className="flex items-center gap-2">
                            <KubisSvg className="h-6 w-6" />
                            <span className="text-lg font-semibold tracking-tight text-white">
                                Kubis Forge
                            </span>
                        </span>
                        <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                            {footer.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                            Navigation
                        </span>
                        <nav className="flex flex-col gap-3">
                            {[
                                {
                                    label: footer.nav.howItWorks,
                                    href: `/${langParam}#how-it-works`,
                                    id: 'how-it-works',
                                },
                                { label: footer.nav.faq, href: `/${langParam}#faq`, id: 'faq' },
                            ].map(({ label, href, id }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={(e) => {
                                        if (pathname === '/') {
                                            scrollToSection(e, id);
                                        }
                                    }}
                                    className="text-sm text-gray-400 transition-colors hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                            <Link
                                href={`/pricing${langParam}`}
                                className="text-sm text-gray-400 transition-colors hover:text-white"
                            >
                                {footer.nav.pricing}
                            </Link>
                            <Link
                                href={`${process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL ?? 'https://kubis.my'}/author`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 transition-colors hover:text-white"
                            >
                                {footer.nav.kubisApp}
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                            Language
                        </span>
                        <div className="flex flex-col gap-3 text-sm">
                            <Link
                                href={pathname}
                                className={`transition-colors ${locale === 'en' ? 'font-medium text-[#4CAF50]' : 'text-gray-400 hover:text-white'}`}
                            >
                                English
                            </Link>
                            <Link
                                href={`${pathname}?lang=ms`}
                                className={`transition-colors ${locale === 'ms' ? 'font-medium text-[#4CAF50]' : 'text-gray-400 hover:text-white'}`}
                            >
                                Bahasa Melayu
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-gray-800/80 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <div>© {new Date().getFullYear()} Kubis Forge</div>
                    <div>Part of the Kubis ecosystem · All rights reserved</div>
                </div>
            </div>
        </footer>
    );
}
