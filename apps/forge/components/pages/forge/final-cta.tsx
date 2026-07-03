import { Button } from '@repo/shadcn-ui/components/button';
import Link from 'next/link';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type FinalCtaProps = {
    content: ForgeContent['finalCta'];
};

export default function FinalCta({ content }: FinalCtaProps) {
    return (
        <section className="bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 px-8 py-16 text-center md:px-16 md:py-20">
                <div className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center">
                    <div className="h-72 w-72 rounded-full bg-[#4CAF50]/30 blur-[120px]" />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#4CAF50]/50 to-transparent" />

                <h2 className="relative text-3xl font-bold tracking-tight text-balance text-white md:text-4xl">
                    {content.title}
                </h2>
                <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-300">
                    {content.description}
                </p>

                <div className="relative mt-9 flex justify-center">
                    <Button
                        size="lg"
                        asChild
                        className="bg-[#4CAF50] shadow-lg shadow-[#4CAF50]/20 hover:bg-[#43A047]"
                    >
                        <Link href="/projects/new">{content.cta}</Link>
                    </Button>
                </div>

                <p className="relative mt-6 text-sm text-gray-400">{content.note}</p>
            </div>
        </section>
    );
}
