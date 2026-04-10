const faqs = [
    {
        question: 'What does MVP mean?',
        answer: 'MVP stands for Minimum Viable Product. It is the first working version of your system that focuses only on the core workflow. The MVP is for validation and testing, not production use.',
    },
    {
        question: 'Is the MVP really free?',
        answer: 'The MVP covers the agreed core workflow only. Production usage requires an active subscription plan.',
    },
    {
        question: 'Can we use the staging system for daily operations?',
        answer: 'No. Staging is for testing and feedback only. Live operations require production setup under a subscription.',
    },
    {
        question: 'Can we request integrations?',
        answer: 'Yes, but integrations are handled as add-ons and scoped separately.',
    },
    {
        question: 'What happens if we stop the subscription?',
        answer: 'Production hosting and managed services may be suspended.',
    },
    {
        question: 'Who manages the server and technical setup?',
        answer: 'Forge manages hosting, infrastructure, deployment, maintenance, and monitoring.',
    },
];

export default function Faq() {
    return (
        <section className="px-6 py-24">
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-16 text-center text-4xl font-bold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                </h2>
                <div className="flex flex-col gap-8">
                    {faqs.map((faq) => (
                        <div key={faq.question}>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                {faq.question}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
