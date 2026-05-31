import type { ForgeContent } from '@/root/libs/i18n/forge-content';
import { AddOn, AddOnCategory } from '@repo/commons/types/forge-service-schema.type';
import { bySortOrder } from '@repo/commons/utils/pagination-helpers';

type AddOnsProps = {
    content: ForgeContent['addOns'];
    addons: AddOn[]
};

export default function AddOns({ content, addons }: AddOnsProps) {
    const standards = addons.filter(row => row.category === AddOnCategory.STANDARD).sort(bySortOrder);
    const optionals = addons.filter(row => row.category === AddOnCategory.OPTIONAL).sort(bySortOrder);

    return (
        <section className="bg-muted px-6 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-foreground mb-4 text-center text-3xl font-bold md:text-4xl">
                    {content.title}
                </h2>
                <p className="text-muted-foreground mb-16 text-center">{content.subtitle}</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {standards.map((item) => (
                        <div
                            key={item.publicId}
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
                        {optionals.map((item) => (
                            <li
                                key={item.publicId}
                                className="border-border bg-card text-muted-foreground rounded-full border px-4 py-2 text-sm"
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
