import Link from 'next/link';
import { Button } from '@repo/shadcn-ui/components/button';
import { FORGE_APP_BASE_URL } from '@repo/commons/constant/base';

export default function FinalCta() {
    return (
        <section className="bg-[#ecf0f1] px-6 py-24 md:py-32 dark:bg-gray-950">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-gray-900 px-8 py-16 text-center md:px-16 dark:border-gray-800">
                <div className="pointer-events-none absolute inset-x-0 -top-24 flex justify-center">
                    <div className="h-72 w-72 rounded-full bg-[#4CAF50]/30 blur-[120px]" />
                </div>

                <h2 className="relative text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Find the application your operation has been missing.
                </h2>
                <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-300">
                    Drowning in spreadsheets, managing orders across a dozen tabs or need a system
                    no tool will sell you? There's a place to start in the KUBIS ecosystem.
                </p>

                <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                        <Link href="/explore-apps">Explore the Ecosystem</Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="border-gray-600 bg-transparent text-white hover:bg-gray-800 hover:text-white"
                    >
                        <Link href={`${FORGE_APP_BASE_URL}/projects/new`}>Start a Project</Link>
                    </Button>
                </div>

                <p className="relative mt-6 text-sm text-gray-400">
                    No bloated demos. No sales theater. Just a direct conversation about what your
                    business actually needs.
                </p>
            </div>
        </section>
    );
}
