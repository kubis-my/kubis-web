import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type WhyItWorksProps = {
    content: ForgeContent['whyItWorks'];
};

export default function WhyItWorks({ content }: WhyItWorksProps) {
    return (
        <section className="px-6 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-foreground mb-12 text-center text-3xl font-bold md:mb-16 md:text-4xl">
                    {content.title}
                </h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {content.reasons.map((reason) => (
                        <div
                            key={reason.title}
                            className="border-border bg-card rounded-lg border p-8"
                        >
                            <h3 className="text-foreground mb-3 text-xl font-semibold">
                                {reason.title}
                            </h3>
                            <p className="text-muted-foreground">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
