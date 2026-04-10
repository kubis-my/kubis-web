import { Check, X } from 'lucide-react';

const included = [
    'Core workflow only',
    'Basic UI',
    'Staging access for review',
    'Scope focused on getting the main process working',
];

const excluded = [
    'Production hosting',
    'Domain setup',
    'Third-party integrations',
    'New modules outside agreed scope',
    'Advanced automation',
    'Heavy reporting',
];

export default function MvpScope() {
    return (
        <section className="bg-muted px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
                    What "Free MVP" Actually Means
                </h2>
                <p className="mb-16 text-center text-muted-foreground">
                    The MVP phase is meant to validate the core workflow only. It is not a
                    production-ready environment.
                </p>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-8">
                        <h3 className="mb-6 text-xl font-semibold text-foreground">
                            Included in MVP
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {included.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#4CAF50]" />
                                    <span className="text-foreground/80">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-8">
                        <h3 className="mb-6 text-xl font-semibold text-foreground">
                            Not Included in MVP
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {excluded.map((item) => (
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
