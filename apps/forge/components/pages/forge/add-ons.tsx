const addOns = [
    { name: 'New Module', price: 'RM2,000 – RM10,000' },
    { name: 'Integration', price: 'RM1,000 – RM5,000' },
    { name: 'Complex Automation', price: 'RM500 – RM2,000' },
];

const optional = [
    'Data migration',
    'Multi-branch setup',
    'Role and permission expansion',
    'Audit trail enhancements',
];

export default function AddOns() {
    return (
        <section className="bg-muted px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
                    Add-Ons
                </h2>
                <p className="mb-16 text-center text-muted-foreground">
                    Extend your system beyond the subscription scope with scoped add-ons.
                </p>
                <div className="grid gap-6 md:grid-cols-3">
                    {addOns.map((item) => (
                        <div
                            key={item.name}
                            className="rounded-lg border border-border bg-card p-6"
                        >
                            <h3 className="mb-2 font-semibold text-foreground">
                                {item.name}
                            </h3>
                            <p className="text-muted-foreground">{item.price}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12">
                    <h3 className="mb-4 text-center text-lg font-semibold text-foreground/80">
                        Optional Add-Ons
                    </h3>
                    <ul className="flex flex-wrap justify-center gap-3">
                        {optional.map((item) => (
                            <li
                                key={item}
                                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
