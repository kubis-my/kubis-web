export const FORGE_LOCALES = ['en', 'ms'] as const;

export type ForgeLocale = (typeof FORGE_LOCALES)[number];

export const DEFAULT_FORGE_LOCALE: ForgeLocale = 'en';

export type ForgeContent = {
    hero: {
        title: string;
        description: string;
        primaryCta: string;
        secondaryCta: string;
        dashboardCta: string;
    };
    howItWorks: {
        title: string;
        subtitle: string;
        steps: Array<{
            number: string;
            title: string;
            description: string;
        }>;
    };
    mvpScope: {
        title: string;
        subtitle: string;
        includedTitle: string;
        excludedTitle: string;
        included: string[];
        excluded: string[];
    };
    pricing: {
        title: string;
        subtitle: string;
        cta: string;
        monthLabel: string;
        plans: Array<{
            name: string;
            price: string;
            description: string;
            badge: string | null;
            included: string[];
            excluded: string[];
            support: string | null;
            featurePolicy: string | null;
        }>;
    };
    addOns: {
        title: string;
        subtitle: string;
        optionalTitle: string;
        items: Array<{
            name: string;
        }>;
        optional: string[];
    };
    whyItWorks: {
        title: string;
        reasons: Array<{
            title: string;
            description: string;
        }>;
    };
    idealClients: {
        title: string;
        subtitle: string;
        clients: string[];
    };
    faq: {
        title: string;
        items: Array<{
            question: string;
            answer: string;
        }>;
    };
    finalCta: {
        title: string;
        description: string;
        cta: string;
    };
    footer: {
        description: string;
        nav: {
            howItWorks: string;
            pricing: string;
            faq: string;
            kubisApp: string;
        };
    };
};

export const FORGE_CONTENT: Record<ForgeLocale, ForgeContent> = {
    en: {
        hero: {
            title: 'Build First, Subscribe When Ready',
            description:
                'Custom business systems built around your workflow. We build your core MVP first. Once it is ready for real production use, you move into a monthly subscription.',
            primaryCta: 'Book a Discovery Call',
            secondaryCta: 'See How the MVP Process Works',
            dashboardCta: 'View my projects',
        },
        howItWorks: {
            title: 'How It Works',
            subtitle: 'A structured process from discovery to production.',
            steps: [
                {
                    number: '01',
                    title: 'Discovery',
                    description:
                        'We review your workflow, pain points, and what the system needs to achieve.',
                },
                {
                    number: '02',
                    title: 'MVP Build',
                    description:
                        'We develop the core system based on the agreed MVP scope. During development, you can monitor progress on a staging server and give feedback.',
                },
                {
                    number: '03',
                    title: 'Validation',
                    description:
                        'You review the MVP to confirm it matches your business needs and is ready for the next phase.',
                },
                {
                    number: '04',
                    title: 'Production Subscription',
                    description:
                        'Once the system is ready for live usage, it moves to production under a monthly subscription plan.',
                },
            ],
        },
        mvpScope: {
            title: 'What "Free MVP" Actually Means',
            subtitle:
                'The MVP phase is meant to validate the core workflow only. It is not a production-ready environment.',
            includedTitle: 'Included in MVP',
            excludedTitle: 'Not Included in MVP',
            included: [
                'Core workflow only',
                'Basic UI',
                'Staging access for review',
                'Scope focused on getting the main process working',
            ],
            excluded: [
                'Production hosting',
                'Domain setup',
                'Third-party integrations',
                'New modules outside agreed scope',
                'Advanced automation',
                'Heavy reporting',
            ],
        },
        pricing: {
            title: 'Subscription Plans',
            subtitle: 'Move into production with a plan that grows with your business.',
            cta: 'Get Started',
            monthLabel: '/month',
            plans: [
                {
                    name: 'Maintenance',
                    price: 'RM200',
                    description: 'For stable systems with no active development needs.',
                    badge: null,
                    included: [
                        'Production hosting',
                        'Uptime monitoring',
                        'Bug fixes only',
                        'Email support',
                        '72-hour response time',
                    ],
                    excluded: [],
                    support: null,
                    featurePolicy: null,
                },
                {
                    name: 'Starter',
                    price: 'RM500',
                    description: 'Suitable for small businesses getting started.',
                    badge: null,
                    included: [
                        'Production hosting',
                        'Maintenance and monitoring',
                        'Bug fixes',
                        'Basic support',
                        '1 active feature request at a time',
                        '48-72 hour response time',
                    ],
                    excluded: [],
                    support: null,
                    featurePolicy: null,
                },
                {
                    name: 'Growth',
                    price: 'RM1,000',
                    description: 'Suitable for growing businesses.',
                    badge: 'Most Popular',
                    included: [
                        'Everything in Starter',
                        'Continuous improvements',
                        '1-2 small feature requests per month',
                        'Priority support',
                        'Managed DB and auto updates',
                        'Performance server',
                        '24-48 hour response time',
                    ],
                    excluded: [],
                    support: null,
                    featurePolicy: null,
                },
                {
                    name: 'Scale',
                    price: 'RM2,000+',
                    description: 'Suitable for advanced or business-critical usage.',
                    badge: null,
                    included: [
                        'Everything in Growth',
                        '3-5 feature requests per month',
                        'Faster turnaround time',
                        'Higher priority handling',
                        'Under 24 hour response time',
                    ],
                    excluded: [],
                    support: null,
                    featurePolicy: null,
                },
            ],
        },
        addOns: {
            title: 'Add-Ons',
            subtitle: 'Extend your system beyond the subscription scope with scoped add-ons.',
            optionalTitle: 'Optional Add-Ons',
            items: [
                { name: 'Minor Changes' },
                { name: 'New Module' },
                { name: 'Integration' },
                { name: 'Complex Automation' },
            ],
            optional: [
                'Data migration',
                'Multi-branch setup',
                'Role and permission expansion',
                'Audit trail enhancements',
            ],
        },
        whyItWorks: {
            title: 'Why This Model Works',
            reasons: [
                {
                    title: 'Lower Upfront Risk',
                    description:
                        'Companies do not need to commit heavily before seeing the core system take shape.',
                },
                {
                    title: 'Faster Validation',
                    description:
                        'The business can confirm whether the workflow is right before moving to full production.',
                },
                {
                    title: 'Continuous Improvement',
                    description:
                        'The system keeps improving after launch instead of becoming stagnant.',
                },
                {
                    title: 'Managed Delivery',
                    description:
                        'Hosting, maintenance, and technical operations stay under one owner, making support easier and more consistent.',
                },
            ],
        },
        idealClients: {
            title: 'Who Is This For?',
            subtitle:
                'Kubis Forge is built for businesses that need a tailored system without a large upfront software cost.',
            clients: [
                'Businesses still relying on spreadsheets and manual processes',
                'Businesses with stock, order, approval, or internal workflow issues',
                'Teams that need a custom internal system but do not want to hire in-house developers',
                'Founders who want a working system first before committing long term',
            ],
        },
        faq: {
            title: 'Frequently Asked Questions',
            items: [
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
                    question: 'How are add-on prices determined?',
                    answer: 'Add-ons are scoped and quoted individually based on complexity and requirements. Contact us to discuss your needs and we will provide a breakdown before any work begins.',
                },
                {
                    question: 'What if we need changes while on the Maintenance plan?',
                    answer: 'Minor changes and new modules are available as scoped add-ons. You stay on the Maintenance plan and pay only for the specific work requested. If you need ongoing monthly development, upgrading to Starter or above is the better fit.',
                },
                {
                    question: 'What happens if we stop the subscription?',
                    answer: 'Production hosting and managed services may be suspended.',
                },
                {
                    question: 'Who manages the server and technical setup?',
                    answer: 'Kubis Forge manages hosting, infrastructure, deployment, maintenance, and monitoring.',
                },
            ],
        },
        finalCta: {
            title: 'Need a Custom System for Your Business?',
            description:
                'Start with an MVP, validate the workflow, then move into production with a plan that grows with your business.',
            cta: "Let's Discuss Your Workflow",
        },
        footer: {
            description:
                'Custom business systems built around your workflow. Build first, subscribe when ready.',
            nav: {
                howItWorks: 'How It Works',
                pricing: 'Pricing',
                faq: 'FAQ',
                kubisApp: 'Author',
            },
        },
    },
    ms: {
        hero: {
            title: 'Bina Dahulu, Langgan Bila Sedia',
            description:
                'Sistem perniagaan khas dibina mengikut aliran kerja anda. Kami bina MVP teras anda dahulu. Apabila sistem sedia untuk penggunaan produksi sebenar, anda beralih ke langganan bulanan.',
            primaryCta: 'Tempah Panggilan Discovery',
            secondaryCta: 'Lihat Proses MVP',
            dashboardCta: 'Lihat projek saya',
        },
        howItWorks: {
            title: 'Bagaimana Ia Berfungsi',
            subtitle: 'Proses tersusun daripada discovery hingga produksi.',
            steps: [
                {
                    number: '01',
                    title: 'Discovery',
                    description:
                        'Kami teliti aliran kerja anda, masalah semasa, dan hasil yang sistem perlu capai.',
                },
                {
                    number: '02',
                    title: 'Pembangunan MVP',
                    description:
                        'Kami membangunkan sistem teras berdasarkan skop MVP yang dipersetujui. Semasa pembangunan, anda boleh pantau kemajuan di pelayan staging dan beri maklum balas.',
                },
                {
                    number: '03',
                    title: 'Pengesahan',
                    description:
                        'Anda semak MVP untuk pastikan ia memenuhi keperluan perniagaan dan sedia ke fasa seterusnya.',
                },
                {
                    number: '04',
                    title: 'Langganan Produksi',
                    description:
                        'Apabila sistem sedia digunakan secara langsung, ia dipindahkan ke produksi di bawah pelan langganan bulanan.',
                },
            ],
        },
        mvpScope: {
            title: 'Apa Maksud Sebenar "MVP Percuma"',
            subtitle:
                'Fasa MVP bertujuan mengesahkan aliran kerja teras sahaja. Ia bukan persekitaran yang sedia untuk produksi.',
            includedTitle: 'Termasuk Dalam MVP',
            excludedTitle: 'Tidak Termasuk Dalam MVP',
            included: [
                'Aliran kerja teras sahaja',
                'UI asas',
                'Akses staging untuk semakan',
                'Skop fokus pada proses utama supaya berfungsi',
            ],
            excluded: [
                'Hosting produksi',
                'Tetapan domain',
                'Integrasi pihak ketiga',
                'Modul baharu di luar skop dipersetujui',
                'Automasi lanjutan',
                'Laporan kompleks',
            ],
        },
        pricing: {
            title: 'Pelan Langganan',
            subtitle: 'Masuk ke produksi dengan pelan yang berkembang bersama perniagaan anda.',
            cta: 'Mula Sekarang',
            monthLabel: '/bulan',
            plans: [
                {
                    name: 'Maintenance',
                    price: 'RM200',
                    description: 'Untuk sistem stabil yang tiada keperluan pembangunan aktif.',
                    badge: null,
                    included: [
                        'Hosting produksi',
                        'Pemantauan uptime',
                        'Pembetulan pepijat sahaja',
                        'Sokongan emel',
                        'Masa respons 72 jam',
                    ],
                    excluded: [],
                    support: null,
                    featurePolicy: null,
                },
                {
                    name: 'Starter',
                    price: 'RM500',
                    description: 'Sesuai untuk perniagaan kecil yang baru bermula.',
                    badge: null,
                    included: [
                        'Hosting produksi',
                        'Penyelenggaraan dan pemantauan',
                        'Pembetulan pepijat',
                        'Sokongan asas',
                        '1 permintaan ciri aktif pada satu masa',
                        'Masa respons 48-72 jam',
                    ],
                    excluded: [],
                    support: null,
                    featurePolicy: null,
                },
                {
                    name: 'Growth',
                    price: 'RM1,000',
                    description: 'Sesuai untuk perniagaan yang sedang berkembang.',
                    badge: 'Paling Popular',
                    included: [
                        'Semua dalam Starter',
                        'Penambahbaikan berterusan',
                        '1-2 permintaan ciri kecil setiap bulan',
                        'Sokongan keutamaan',
                        'DB terurus dan kemaskini automatik',
                        'Pelayan berprestasi',
                        'Masa respons 24-48 jam',
                    ],
                    excluded: [],
                    support: null,
                    featurePolicy: null,
                },
                {
                    name: 'Scale',
                    price: 'RM2,000+',
                    description: 'Sesuai untuk penggunaan lanjutan atau kritikal perniagaan.',
                    badge: null,
                    included: [
                        'Semua dalam Growth',
                        '3-5 permintaan ciri setiap bulan',
                        'Masa siap lebih cepat',
                        'Keutamaan lebih tinggi',
                        'Masa respons bawah 24 jam',
                    ],
                    excluded: [],
                    support: null,
                    featurePolicy: null,
                },
            ],
        },
        addOns: {
            title: 'Add-On',
            subtitle: 'Luaskan sistem anda di luar skop langganan melalui add-on berasaskan skop.',
            optionalTitle: 'Add-On Pilihan',
            items: [
                { name: 'Perubahan Kecil' },
                { name: 'Modul Baharu' },
                { name: 'Integrasi' },
                { name: 'Automasi Kompleks' },
            ],
            optional: [
                'Migrasi data',
                'Tetapan multi-cawangan',
                'Pengembangan peranan dan kebenaran',
                'Penambahbaikan audit trail',
            ],
        },
        whyItWorks: {
            title: 'Kenapa Model Ini Berkesan',
            reasons: [
                {
                    title: 'Risiko Permulaan Lebih Rendah',
                    description:
                        'Syarikat tidak perlu membuat komitmen besar sebelum melihat sistem teras mula terbentuk.',
                },
                {
                    title: 'Pengesahan Lebih Cepat',
                    description:
                        'Perniagaan boleh sahkan sama ada aliran kerja tepat sebelum bergerak ke produksi penuh.',
                },
                {
                    title: 'Penambahbaikan Berterusan',
                    description:
                        'Sistem terus ditambah baik selepas pelancaran dan tidak menjadi statik.',
                },
                {
                    title: 'Penyampaian Terkawal',
                    description:
                        'Hosting, penyelenggaraan, dan operasi teknikal berada di bawah satu pemilik, jadi sokongan lebih mudah dan konsisten.',
                },
            ],
        },
        idealClients: {
            title: 'Sesuai Untuk Siapa?',
            subtitle:
                'Kubis Forge dibina untuk perniagaan yang perlukan sistem tersuai tanpa kos perisian permulaan yang besar.',
            clients: [
                'Perniagaan yang masih bergantung pada spreadsheet dan proses manual',
                'Perniagaan yang ada isu stok, pesanan, kelulusan, atau aliran kerja dalaman',
                'Pasukan yang perlukan sistem dalaman tersuai tetapi tidak mahu mengambil pembangun dalaman',
                'Pengasas yang mahu sistem berfungsi dahulu sebelum komitmen jangka panjang',
            ],
        },
        faq: {
            title: 'Soalan Lazim',
            items: [
                {
                    question: 'Apa maksud MVP?',
                    answer: 'MVP ialah Minimum Viable Product. Ia versi pertama sistem anda yang berfungsi dengan fokus pada aliran kerja teras sahaja. MVP digunakan untuk pengesahan dan ujian, bukan penggunaan produksi.',
                },
                {
                    question: 'Adakah MVP benar-benar percuma?',
                    answer: 'MVP meliputi aliran kerja teras yang dipersetujui sahaja. Penggunaan produksi memerlukan pelan langganan aktif.',
                },
                {
                    question: 'Bolehkah kami guna sistem staging untuk operasi harian?',
                    answer: 'Tidak. Staging hanya untuk ujian dan maklum balas. Operasi langsung memerlukan tetapan produksi di bawah langganan.',
                },
                {
                    question: 'Bolehkah kami minta integrasi?',
                    answer: 'Ya, tetapi integrasi diuruskan sebagai add-on dengan skop berasingan.',
                },
                {
                    question: 'Bagaimana harga add-on ditentukan?',
                    answer: 'Add-on diskop dan dikuotakan secara individu berdasarkan kerumitan dan keperluan. Hubungi kami untuk berbincang dan kami akan berikan pecahan kos sebelum sebarang kerja dimulakan.',
                },
                {
                    question:
                        'Bagaimana jika kami perlukan perubahan semasa dalam pelan Maintenance?',
                    answer: 'Perubahan kecil dan modul baharu tersedia sebagai add-on berasaskan skop. Anda kekal dalam pelan Maintenance dan hanya bayar untuk kerja yang diminta. Jika anda perlukan pembangunan bulanan yang berterusan, naik taraf ke Starter atau lebih tinggi adalah pilihan yang lebih sesuai.',
                },
                {
                    question: 'Apa jadi jika kami hentikan langganan?',
                    answer: 'Hosting produksi dan perkhidmatan terurus mungkin akan digantung.',
                },
                {
                    question: 'Siapa urus server dan tetapan teknikal?',
                    answer: 'Kubis Forge mengurus hosting, infrastruktur, deployment, penyelenggaraan, dan pemantauan.',
                },
            ],
        },
        finalCta: {
            title: 'Perlu Sistem Tersuai Untuk Perniagaan Anda?',
            description:
                'Mulakan dengan MVP, sahkan aliran kerja, kemudian masuk ke produksi dengan pelan yang berkembang bersama perniagaan anda.',
            cta: 'Jom Bincang Aliran Kerja Anda',
        },
        footer: {
            description:
                'Sistem perniagaan khas dibina mengikut aliran kerja anda. Bina dahulu, langgan bila sedia.',
            nav: {
                howItWorks: 'Cara Ia Berfungsi',
                pricing: 'Harga',
                faq: 'Soalan Lazim',
                kubisApp: 'Kubis App',
            },
        },
    },
};

export function resolveForgeLocale(lang?: string): ForgeLocale {
    if (lang === 'ms') {
        return 'ms';
    }

    return DEFAULT_FORGE_LOCALE;
}
