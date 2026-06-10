const STEPS = [
    {
        index: '01',
        title: 'Start with one problem',
        body: 'Pick the workflow that hurts most. Orders? A custom system? Begin with the application that solves it.',
    },
    {
        index: '02',
        title: 'Get the right application',
        body: 'Commission a Forge build today, or get early access to Ops as it ships. Each is built and configured around your operation, not a generic template.',
    },
    {
        index: '03',
        title: 'Expand the ecosystem',
        body: 'As new KUBIS applications ship, they plug into the foundation you already have. Grow into the platform, one app at a time.',
    },
];

export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="scroll-mt-16 bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950"
        >
            <div className="mx-auto max-w-5xl">
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                    Getting started is a conversation, not a{' '}
                    <br className="hidden md:inline" /> 6 month rollout.
                </h2>

                <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
                    {STEPS.map((s) => (
                        <div key={s.index}>
                            <span className="font-mono text-sm font-medium text-[#4CAF50]">
                                {s.index}
                            </span>
                            <div className="mt-3 h-px w-full bg-gray-200 dark:bg-gray-800" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                                {s.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {s.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
