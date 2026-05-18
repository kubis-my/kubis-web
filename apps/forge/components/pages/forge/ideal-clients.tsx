import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type IdealClientsProps = {
    content: ForgeContent['idealClients'];
};

export default function IdealClients({ content }: IdealClientsProps) {
    return (
        <section className="bg-muted px-6 py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                    {content.title}
                </h2>
                <p className="text-muted-foreground mb-12">{content.subtitle}</p>
                <ul className="flex flex-col gap-4">
                    {content.clients.map((client) => (
                        <li
                            key={client}
                            className="border-border bg-card text-foreground/80 rounded-lg border px-6 py-4 text-left"
                        >
                            {client}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
