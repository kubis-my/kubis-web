import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type IdealClientsProps = {
    content: ForgeContent['idealClients'];
};

export default function IdealClients({ content }: IdealClientsProps) {
    return (
        <section className="bg-muted px-6 py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{content.title}</h2>
                <p className="mb-12 text-muted-foreground">{content.subtitle}</p>
                <ul className="flex flex-col gap-4">
                    {content.clients.map((client) => (
                        <li
                            key={client}
                            className="rounded-lg border border-border bg-card px-6 py-4 text-left text-foreground/80"
                        >
                            {client}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
