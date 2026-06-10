import { IconBox, IconStack2, IconArrowsShuffle } from '@tabler/icons-react';

const PILLARS = [
    {
        icon: IconBox,
        title: 'Purpose-built, not generic',
        body: 'Each application is designed around a real business workflow, not a blank canvas you have to assemble yourself.',
    },
    {
        icon: IconStack2,
        title: 'One foundation underneath',
        body: 'Shared infrastructure, multi-tenant architecture and a single account. Your apps work together because they were built to.',
    },
    {
        icon: IconArrowsShuffle,
        title: 'Modular by design',
        body: 'Start with what you need today. Expand into new applications as the business and the ecosystem, grows.',
    },
];

export default function EcosystemModel() {
    return (
        <section className="bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950">
            <div className="mx-auto max-w-5xl text-center">
                <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                    The model
                </span>
                <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                    One platform. Purpose-built applications. Built to grow with you.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    KUBIS isn't a single app trying to do everything. It's an ecosystem of focused
                    applications, each one designed to own a specific part of how your business
                    runs. Use one. Use several. They share the same foundation, the same data model
                    and the same login, so adding the next application is a decision, not a
                    migration.
                </p>

                <div className="mt-14 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
                    {PILLARS.map(({ icon: Icon, title, body }) => (
                        <div key={title}>
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#4CAF50]/10">
                                <Icon className="h-5 w-5 text-[#4CAF50]" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
