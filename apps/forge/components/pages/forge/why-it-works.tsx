const reasons = [
    {
        title: 'Lower Upfront Risk',
        description:
            'Clients do not need to commit heavily before seeing the core system take shape.',
    },
    {
        title: 'Faster Validation',
        description:
            'The business can confirm whether the workflow is right before moving to full production.',
    },
    {
        title: 'Continuous Improvement',
        description:
            'The system keeps improving after launch instead of becoming stagnant.',
    },
    {
        title: 'Managed Delivery',
        description:
            'Hosting, maintenance, and technical operations stay under one owner, making support easier and more consistent.',
    },
];

export default function WhyItWorks() {
    return (
        <section className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-16 text-center text-4xl font-bold text-foreground">
                    Why This Model Works
                </h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {reasons.map((reason) => (
                        <div
                            key={reason.title}
                            className="rounded-lg border border-border bg-card p-8"
                        >
                            <h3 className="mb-3 text-xl font-semibold text-foreground">
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
