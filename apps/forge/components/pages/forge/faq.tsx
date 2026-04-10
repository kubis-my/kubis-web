import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type FaqProps = {
    content: ForgeContent['faq'];
};

export default function Faq({ content }: FaqProps) {
    return (
        <section id="faq" className="px-6 py-16 md:py-24">
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:mb-16 md:text-4xl">{content.title}</h2>
                <div className="flex flex-col gap-8">
                    {content.items.map((faq) => (
                        <div key={faq.question}>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">{faq.question}</h3>
                            <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
