import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type AddOnsProps = {
    content: ForgeContent['addOns'];
};

export default function AddOns({ content }: AddOnsProps) {
    return (
        <section className="bg-muted px-6 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-foreground mb-4 text-center text-3xl font-bold md:text-4xl">
                    {content.title}
                </h2>
                <p className="text-muted-foreground mb-16 text-center">{content.subtitle}</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {content.items.map((item) => (
                        <div
                            key={item.name}
                            className="border-border bg-card rounded-lg border p-6 text-center"
                        >
                            <h3 className="text-foreground font-semibold">{item.name}</h3>
                        </div>
                    ))}
                </div>
                <div className="mt-12">
                    <h3 className="text-foreground/80 mb-4 text-center text-lg font-semibold">
                        {content.optionalTitle}
                    </h3>
                    <ul className="flex flex-wrap justify-center gap-3">
                        {content.optional.map((item) => (
                            <li
                                key={item}
                                className="border-border bg-card text-muted-foreground rounded-full border px-4 py-2 text-sm"
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
