const PROBLEMS = [
    {
        title: 'Disconnected tools',
        body: "Five apps that don't talk to each other and data re-entered between every one.",
    },
    {
        title: 'Manual workflows',
        body: 'Work that stalls because someone has to remember to move it forward.',
    },
    {
        title: 'Spreadsheet ceilings',
        body: 'The spreadsheet that ran the company, until it became the bottleneck.',
    },
];

export default function Problem() {
    return (
        <section className="border-t border-gray-200 bg-white px-6 py-20 md:py-28 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl">
                <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                    The real cost of “we’ll just use a spreadsheet”
                </span>
                <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                    Most growing businesses don’t have a software problem. They have{' '}
                    <span className="text-[#4CAF50]">too many</span> of them.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    A spreadsheet for orders. Another for inventory. A chat thread for approvals. A
                    tool for one team, a different tool for another and one person who's the only
                    one who knows how it all connects. It works, until the business grows faster
                    than the duct tape holding it together.
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {PROBLEMS.map((p) => (
                        <div
                            key={p.title}
                            className="rounded-2xl border border-gray-200 bg-[#ecf0f1]/60 p-6 dark:border-gray-800 dark:bg-gray-950/60"
                        >
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {p.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {p.body}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="mt-10 text-lg font-medium text-gray-900 dark:text-white">
                    KUBIS exists to replace all three.
                </p>
            </div>
        </section>
    );
}
