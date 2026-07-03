import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type HowItWorksProps = {
    content: ForgeContent['howItWorks'];
};

export default function HowItWorks({ content }: HowItWorksProps) {
    return (
        <section
            id="how-it-works"
            className="scroll-mt-16 border-t border-gray-200 bg-white px-6 py-20 md:py-28 dark:border-gray-800 dark:bg-gray-900"
        >
            <div className="mx-auto max-w-6xl">
                <div className="max-w-2xl">
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        {content.eyebrow}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        {content.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {content.subtitle}
                    </p>
                </div>

                <div className="relative mt-14">
                    {/* Connector line (desktop) */}
                    <div className="absolute top-6 right-0 left-0 hidden h-px bg-linear-to-r from-[#4CAF50]/40 via-gray-200 to-gray-200 lg:block dark:via-gray-800 dark:to-gray-800" />

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {content.steps.map((step) => (
                            <div key={step.number} className="relative">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#4CAF50]/30 bg-white text-base font-bold text-[#2e7d32] shadow-sm dark:bg-gray-900 dark:text-[#81c784]">
                                    {step.number}
                                </div>
                                <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
