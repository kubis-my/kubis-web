const ROADMAP = [
    { name: 'Automation', body: 'Connect your workflows and let the routine work run itself.' },
    { name: 'Internal Tools', body: 'Spin up the small, specific apps your team keeps asking for.' },
    { name: 'Operations Suite', body: 'Deeper applications for the way your business runs.' },
];

export default function ExploreRoadmap() {
    return (
        <section className="bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950">
            <div className="mx-auto max-w-6xl">
                <div className="max-w-2xl">
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        On the roadmap
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        The ecosystem is expanding.
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        Every new application is built on the same foundation, so when it ships,
                        it’s already part of your KUBIS.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {ROADMAP.map((c) => (
                        <div
                            key={c.name}
                            className="rounded-2xl border border-dashed border-gray-300 p-6 dark:border-gray-700"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-base font-semibold text-gray-500 dark:text-gray-400">
                                    {c.name}
                                </span>
                                <span className="text-[10px] font-medium tracking-wide text-gray-400 uppercase dark:text-gray-600">
                                    Coming soon
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-500">
                                {c.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
