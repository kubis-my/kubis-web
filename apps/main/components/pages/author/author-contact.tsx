import Link from 'next/link';
import { Button } from '@repo/shadcn-ui/components/button';
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconMail,
    IconArrowRight,
} from '@tabler/icons-react';

export default function AuthorContact() {
    return (
        <section
            id="contact"
            className="scroll-mt-16 bg-[#ecf0f1] px-6 pb-24 md:pb-32 dark:bg-gray-950"
        >
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-gray-900 px-8 py-16 text-center md:px-16 dark:border-gray-800">
                <div className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center">
                    <div className="h-72 w-72 rounded-full bg-[#4CAF50]/30 blur-[120px]" />
                </div>

                <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Need someone who can turn business problems into production-ready software?
                </h2>
                <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-300">
                    Every project starts with a conversation. Tell me the problem and we'll explore whether KUBIS is the right solution for it.
                </p>

                <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                        <Link href="mailto:zarkashi@kubis.my">
                            <IconMail className="h-4 w-4" />
                            Email Me
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="border-gray-600 bg-transparent text-white hover:bg-gray-800 hover:text-white"
                    >
                        <Link href="/explore-apps">
                            Explore KUBIS Apps
                            <IconArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="relative mt-8 flex items-center justify-center gap-5 text-sm text-gray-400">
                    <Link
                        href="https://github.com/kashi93"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors hover:text-white"
                    >
                        <IconBrandGithub className="h-4 w-4" />
                        GitHub
                    </Link>
                    <Link
                        href="https://linkedin.com/in/zarkashi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 transition-colors hover:text-white"
                    >
                        <IconBrandLinkedin className="h-4 w-4" />
                        LinkedIn
                    </Link>
                </div>
            </div>
        </section>
    );
}
