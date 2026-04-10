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
        <section className="bg-gray-50 px-6 py-24 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-white">
                    What "Free MVP" Actually Means
                </h2>
                <p className="mb-16 text-center text-gray-600 dark:text-gray-400">
                    The MVP phase is meant to validate the core workflow only. It is not a
                    production-ready environment.
                </p>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                            Included in MVP
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {included.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                            Not Included in MVP
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {excluded.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
