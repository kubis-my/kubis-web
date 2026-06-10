export default function AuthorStory() {
    return (
        <section className="border-t border-gray-200 bg-white px-6 py-20 md:py-28 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        Why KUBIS
                    </span>
                    <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        The same broken pattern, in every business I built for.
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg dark:text-gray-400">
                        After years of building custom systems for real businesses, I noticed the
                        same pattern companies were stuck with spreadsheets, disconnected tools and
                        software that never quite matched how they worked.
                    </p>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg dark:text-gray-400">
                        KUBIS is my answer, a modular ecosystem of purpose-built applications
                        designed around real operational problems.
                    </p>
                </div>

                <div className="flex flex-col justify-center">
                    <blockquote className="rounded-2xl border-l-2 border-[#4CAF50] bg-[#ecf0f1]/60 p-6 text-lg leading-relaxed font-medium text-gray-800 dark:bg-gray-950/50 dark:text-gray-200">
                        “Most businesses don't need more software. They need the right software,
                        built for how they actually work. That's what KUBIS is for.”
                    </blockquote>
                </div>
            </div>
        </section>
    );
}
