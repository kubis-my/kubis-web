import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type AddOnsProps = {
    content: ForgeContent['addOns'];
};

export default function AddOns({ content }: AddOnsProps) {
    return (
        <section className="bg-muted px-6 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">{content.title}</h2>
                <p className="mb-16 text-center text-muted-foreground">{content.subtitle}</p>
                <div className="grid gap-6 md:grid-cols-3">
                    {content.items.map((item) => (
                        <div key={item.name} className="rounded-lg border border-border bg-card p-6">
                            <h3 className="mb-2 font-semibold text-foreground">{item.name}</h3>
                            <p className="text-muted-foreground">{item.price}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12">
                    <h3 className="mb-4 text-center text-lg font-semibold text-foreground/80">
                        {content.optionalTitle}
                    </h3>
                    <ul className="flex flex-wrap justify-center gap-3">
                        {content.optional.map((item) => (
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
