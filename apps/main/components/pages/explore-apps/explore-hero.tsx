export default function ExploreHero() {
    return (
        <section className="relative overflow-hidden bg-[#ecf0f1] px-6 pt-20 pb-16 md:pt-28 md:pb-20 dark:bg-gray-950">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
                <div className="h-[360px] w-[640px] rounded-full bg-[#4CAF50]/10 blur-[140px]" />
            </div>

            <div className="mx-auto max-w-4xl text-center">
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#2e7d32] dark:text-[#81c784]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
                    The applications
                </span>

                <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
                    One ecosystem.{' '}
                    <span className="text-[#4CAF50]">Purpose-built applications.</span>
                </h1>

                <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                    Every KUBIS application solves a real operational problem end-to-end. Start with
                    the one that fits today. The rest plug into the same foundation as they ship.
                </p>
            </div>
        </section>
    );
}
