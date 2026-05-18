import { Check, X } from 'lucide-react';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type MvpScopeProps = {
    content: ForgeContent['mvpScope'];
};

export default function MvpScope({ content }: MvpScopeProps) {
    return (
        <section className="bg-muted px-6 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-foreground mb-4 text-center text-3xl font-bold md:text-4xl">
                    {content.title}
                </h2>
                <p className="text-muted-foreground mb-16 text-center">{content.subtitle}</p>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="border-border bg-card rounded-lg border p-8">
                        <h3 className="text-foreground mb-6 text-xl font-semibold">
                            {content.includedTitle}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {content.included.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#4CAF50]" />
                                    <span className="text-foreground/80">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-border bg-card rounded-lg border p-8">
                        <h3 className="text-foreground mb-6 text-xl font-semibold">
                            {content.excludedTitle}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {content.excluded.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                                    <span className="text-foreground/80">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
