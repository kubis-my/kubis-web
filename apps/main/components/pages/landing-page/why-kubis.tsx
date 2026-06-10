const REASONS = [
    {
        title: 'Built like production SaaS, not an internal hack',
        body: "Multi-tenant architecture, proper data isolation, CI/CD and the engineering standards of software meant to scale.",
    },
    {
        title: 'Focused applications, not bloated suites',
        body: "Each app does one thing thoroughly. No feature-bloat you'll never touch, no “platform” you configure for a month before it works.",
    },
    {
        title: 'One ecosystem, one source of truth',
        body: "Your applications share a foundation, so your data isn't scattered across five logins. Add an app, and it already fits.",
    },
    {
        title: 'Built to replace, not to add',
        body: "KUBIS isn't another tab in your stack. The goal is to remove the spreadsheets and disconnected tools, not pile on top of them.",
    },
];

export default function WhyKubis() {
    return (
        <section
            id="why"
            className="scroll-mt-16 bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950"
        >
            <div className="mx-auto max-w-5xl">
                <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                    Why KUBIS
                </span>
                <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                    The discipline of a real product, with the focus of a tool built for one job.
                </h2>

                <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-800">
                    {REASONS.map((r) => (
                        <div
                            key={r.title}
                            className="bg-white p-6 sm:p-8 dark:bg-gray-900"
                        >
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {r.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {r.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
