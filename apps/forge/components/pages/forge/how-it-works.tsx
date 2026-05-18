import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type HowItWorksProps = {
    content: ForgeContent['howItWorks'];
};

export default function HowItWorks({ content }: HowItWorksProps) {
    return (
        <section id="how-it-works" className="px-6 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-foreground mb-4 text-center text-3xl font-bold md:text-4xl">
                    {content.title}
                </h2>
                <p className="text-muted-foreground mb-16 text-center">{content.subtitle}</p>
                <div className="grid gap-8 md:grid-cols-2">
                    {content.steps.map((step) => (
                        <div key={step.number} className="flex gap-6">
                            <span className="text-4xl font-bold text-[#4CAF50]/25">
                                {step.number}
                            </span>
                            <div>
                                <h3 className="text-foreground mb-2 text-xl font-semibold">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
