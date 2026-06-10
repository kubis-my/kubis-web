import HeroCta from './hero-cta';

const MODULES = [
    { name: 'Forge', live: true },
    { name: 'Ops', live: false },
    { name: 'More', live: false },
];

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-[#ecf0f1] px-6 pt-20 pb-24 md:pt-28 md:pb-32 dark:bg-gray-950">
            {/* Ambient accent */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
                <div className="h-[420px] w-[720px] rounded-full bg-[#4CAF50]/10 blur-[140px]" />
            </div>

            <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#2e7d32] dark:text-[#81c784]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
                    A modular business software ecosystem
                </span>

                <h1 className="max-w-[900px] text-4xl leading-[1.08] font-bold tracking-tight text-balance text-gray-900 sm:text-5xl sm:leading-[1.05] md:text-7xl dark:text-white">
                    Run your business on <span className="text-[#4CAF50]">software</span>, not
                    spreadsheets
                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-400">
                    KUBIS is a modular ecosystem of purpose-built apps that replace the spreadsheets,
                    manual workflows and disconnected tools your operations run on today. Start with
                    one app. Add more as you grow.
                </p>

                <div className="mt-10">
                    <HeroCta />
                </div>

                <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                    Built by an engineer, not a marketing team. Multi-tenant. Production-grade.
                </p>

                {/* Ecosystem module grid: shows the "ecosystem" at a glance */}
                <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
                    {MODULES.map((m) => (
                        <div
                            key={m.name}
                            className={
                                m.live
                                    ? 'flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm dark:border-gray-800 dark:bg-gray-900'
                                    : 'flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-transparent px-4 py-3 text-left dark:border-gray-700'
                            }
                        >
                            <span
                                className={
                                    m.live
                                        ? 'text-sm font-semibold text-gray-900 dark:text-white'
                                        : 'text-sm font-medium text-gray-400 dark:text-gray-500'
                                }
                            >
                                {m.name}
                            </span>
                            <span
                                className={
                                    m.live
                                        ? 'text-[10px] font-medium tracking-wide text-[#4CAF50] uppercase'
                                        : 'text-[10px] font-medium tracking-wide text-gray-400 uppercase dark:text-gray-600'
                                }
                            >
                                {m.live ? 'Live' : 'Soon'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
