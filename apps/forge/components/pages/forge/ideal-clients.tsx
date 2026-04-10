const clients = [
    'SMEs still relying on spreadsheets and manual processes',
    'Businesses with stock, order, approval, or internal workflow issues',
    'Teams that need a custom internal system but do not want to hire in-house developers',
    'Founders who want a working system first before committing long term',
];

export default function IdealClients() {
    return (
        <section className="bg-gray-50 px-6 py-24 dark:bg-gray-900">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                    Who Is This For?
                </h2>
                <p className="mb-12 text-gray-600 dark:text-gray-400">
                    Forge is built for businesses that need a tailored system without a large
                    upfront software cost.
                </p>
                <ul className="flex flex-col gap-4">
                    {clients.map((client) => (
                        <li
                            key={client}
                            className="rounded-lg border border-gray-200 bg-white px-6 py-4 text-left text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                            {client}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
