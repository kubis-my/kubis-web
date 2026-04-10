const addOns = [
    { name: 'New Module', price: 'RM2,000 – RM10,000' },
    { name: 'Integration', price: 'RM1,000 – RM5,000' },
    { name: 'Complex Automation', price: 'RM500 – RM2,000' },
];

const optional = [
    'Data migration',
    'Multi-branch setup',
    'Role and permission expansion',
    'Audit trail enhancements',
];

export default function AddOns() {
    return (
        <section className="bg-gray-50 px-6 py-24 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-white">
                    Add-Ons
                </h2>
                <p className="mb-16 text-center text-gray-600 dark:text-gray-400">
                    Extend your system beyond the subscription scope with scoped add-ons.
                </p>
                <div className="grid gap-6 md:grid-cols-3">
                    {addOns.map((item) => (
                        <div
                            key={item.name}
                            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                        >
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                {item.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">{item.price}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12">
                    <h3 className="mb-4 text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Optional Add-Ons
                    </h3>
                    <ul className="flex flex-wrap justify-center gap-3">
                        {optional.map((item) => (
                            <li
                                key={item}
                                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
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
