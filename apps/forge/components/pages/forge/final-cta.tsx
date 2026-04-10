import { Button } from '@repo/shadcn-ui/components/button';
import Link from 'next/link';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type FinalCtaProps = {
    content: ForgeContent['finalCta'];
};

export default function FinalCta({ content }: FinalCtaProps) {
    return (
        <section className="bg-gray-900 px-6 py-16 text-center md:py-24 dark:bg-gray-950">
            <div className="mx-auto max-w-2xl">
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{content.title}</h2>
                <p className="mb-10 text-lg text-gray-400">{content.description}</p>
                <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                    <Link href="#">{content.cta}</Link>
                </Button>
            </div>
        </section>
    );
}
