import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type WhyItWorksProps = {
    content: ForgeContent['whyItWorks'];
};

export default function WhyItWorks({ content }: WhyItWorksProps) {
    return (
        <section className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-16 text-center text-4xl font-bold text-foreground">{content.title}</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {content.reasons.map((reason) => (
                        <div
                            key={reason.title}
                            className="rounded-lg border border-border bg-card p-8"
                        >
                            <h3 className="mb-3 text-xl font-semibold text-foreground">{reason.title}</h3>
                            <p className="text-muted-foreground">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
