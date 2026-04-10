'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import KubisSvg from '@repo/shadcn-ui/custom-components/kubis-svg';
import { scrollToSection } from '@repo/commons/utils/dom';
import Link from 'next/link';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type HeroProps = {
    content: ForgeContent['hero'];
};

export default function Hero({ content }: HeroProps) {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
            <div className="flex max-w-3xl flex-col items-center gap-6">
                <KubisSvg className="h-32 w-32" />
                <h1 className="text-5xl leading-tight font-bold text-foreground md:text-6xl">
                    {content.title}
                </h1>
                <p className="text-xl text-muted-foreground">{content.description}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                        <Link href="#">{content.primaryCta}</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>
                            {content.secondaryCta}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
