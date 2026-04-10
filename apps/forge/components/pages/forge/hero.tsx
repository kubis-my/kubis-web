import { Button } from '@repo/shadcn-ui/components/button';
import Link from 'next/link';
import type { ForgeContent, ForgeLocale } from '@/root/libs/i18n/forge-content';

type HeroProps = {
    content: ForgeContent['hero'];
    locale: ForgeLocale;
};

export default function Hero({ content, locale }: HeroProps) {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
            <div className="flex max-w-3xl flex-col items-center gap-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                    <span>{content.languageLabel}</span>
                    <Link
                        href="/?lang=en"
                        className={`rounded-full px-2 py-1 ${
                            locale === 'en' ? 'bg-[#4CAF50] text-white' : 'hover:text-foreground'
                        }`}
                    >
                        {content.englishLabel}
                    </Link>
                    <Link
                        href="/?lang=ms"
                        className={`rounded-full px-2 py-1 ${
                            locale === 'ms' ? 'bg-[#4CAF50] text-white' : 'hover:text-foreground'
                        }`}
                    >
                        {content.malayLabel}
                    </Link>
                </div>
                <h1 className="text-5xl leading-tight font-bold text-foreground md:text-6xl">
                    {content.title}
                </h1>
                <p className="text-xl text-muted-foreground">{content.description}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                        <Link href="#">{content.primaryCta}</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#how-it-works">{content.secondaryCta}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
