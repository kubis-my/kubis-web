export const FORGE_LOCALES = ['en', 'ms'] as const;

export type ForgeLocale = (typeof FORGE_LOCALES)[number];

export const DEFAULT_FORGE_LOCALE: ForgeLocale = 'en';

export type ForgeContent = {
    hero: {
        badge: string;
        title: string;
        description: string;
        primaryCta: string;
        secondaryCta: string;
        trustLine: string;
        dashboardCta: string;
        flow: string[];
    };
    painPoints: {
        eyebrow: string;
        title: string;
        subtitle: string;
        items: Array<{
            title: string;
            description: string;
        }>;
    };
    idealClients: {
        eyebrow: string;
        title: string;
        subtitle: string;
        clients: string[];
    };
    howItWorks: {
        eyebrow: string;
        title: string;
        subtitle: string;
        steps: Array<{
            number: string;
            title: string;
            description: string;
        }>;
    };
    mvpScope: {
        eyebrow: string;
        title: string;
        subtitle: string;
        includedTitle: string;
        excludedTitle: string;
        includedNote: string;
        excludedNote: string;
        included: string[];
        excluded: string[];
    };
    pricing: {
        eyebrow: string;
        title: string;
        subtitle: string;
        trustLine: string;
        cta: string;
        monthLabel: string;
    };
    addOns: {
        eyebrow: string;
        title: string;
        subtitle: string;
        optionalTitle: string;
        noteTitle: string;
        note: string;
        noteCta: string;
    };
    whyItWorks: {
        eyebrow: string;
        title: string;
        reasons: Array<{
            title: string;
            description: string;
        }>;
    };
    faq: {
        eyebrow: string;
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
        note: string;
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
            badge: 'Custom internal systems for growing businesses',
            title: 'Build Your Business System First. Subscribe Only When It Works.',
            description:
                'Kubis Forge helps businesses turn manual workflows into custom internal systems. We build the core MVP first, validate it with your team, then move it into production under a monthly subscription.',
            primaryCta: 'Book a Discovery Call',
            secondaryCta: 'View MVP Process',
            trustLine:
                'No large upfront software cost · MVP first · Production-ready subscription later',
            dashboardCta: 'View my projects',
            flow: ['Build MVP', 'Validate flow', 'Move to production'],
        },
        painPoints: {
            eyebrow: 'Sound familiar?',
            title: 'Still running your business on spreadsheets, WhatsApp and manual follow-ups?',
            subtitle:
                'Forge is designed for teams whose real workflow does not fit generic off-the-shelf tools.',
            items: [
                {
                    title: 'Stock and order tracking is messy',
                    description:
                        'Quantities live across several spreadsheets and by Friday none of them agree.',
                },
                {
                    title: 'Approvals depend on chat messages',
                    description:
                        'A quote or request sits in someone’s WhatsApp until they remember to reply.',
                },
                {
                    title: 'Reports take hours of manual work',
                    description:
                        'Every month starts with copy-paste, formulas and hoping the numbers line up.',
                },
                {
                    title: 'Existing tools don’t match your workflow',
                    description:
                        'You keep bending your process to fit the software instead of the other way around.',
                },
            ],
        },
        idealClients: {
            eyebrow: 'Who it’s for',
            title: 'Built for businesses that outgrew their tools',
            subtitle:
                'Kubis Forge is for teams that need a tailored internal system without a large upfront software cost or an in-house engineering team.',
            clients: [
                'Businesses still relying on spreadsheets and manual processes',
                'Businesses with stock, order, approval, or internal workflow issues',
                'Teams that need a custom internal system without hiring in-house developers',
                'Founders who want a working system before committing long term',
            ],
        },
        howItWorks: {
            eyebrow: 'The process',
            title: 'How It Works',
            subtitle:
                'A structured path from first conversation to production, in four clear steps.',
            steps: [
                {
                    number: '01',
                    title: 'Discovery',
                    description:
                        'We review your workflow, pain points and what the system needs to achieve.',
                },
                {
                    number: '02',
                    title: 'MVP Build',
                    description:
                        'We develop the core system based on the agreed MVP scope. You can monitor progress on staging and give feedback.',
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
            eyebrow: 'MVP scope',
            title: 'What the MVP Phase Covers',
            subtitle:
                'The MVP phase is focused on validating the core workflow. It is not a full production environment.',
            includedTitle: 'Included in MVP',
            excludedTitle: 'Available After MVP',
            includedNote: 'Everything needed to validate the main process',
            excludedNote: 'Unlocked once you move into a production subscription',
            included: [
                'Core workflow only',
                'Basic UI',
                'Staging access for review',
                'Scope focused on getting the main process working',
            ],
            excluded: [
                'Production hosting',
                'Custom domain setup',
                'Third-party integrations',
                'New modules outside agreed scope',
                'Advanced automation',
                'Reporting and analytics',
            ],
        },
        pricing: {
            eyebrow: 'Subscription plans',
            title: 'Simple pricing for production systems',
            subtitle: 'Move into production with a plan that grows with your business.',
            trustLine: 'MVP built first · You only subscribe once your system is production-ready',
            cta: 'Get Started',
            monthLabel: '/month',
        },
        addOns: {
            eyebrow: 'Extend your system',
            title: 'Add-Ons',
            subtitle: 'Extend your system beyond the subscription scope with scoped add-ons.',
            optionalTitle: 'Optional Add-Ons',
            noteTitle: 'Have a request that does not fit into these plans?',
            note: 'Forge can also support one-off engagements for custom or ad-hoc work, with no subscription required. Just let the Kubis team know in your project thread.',
            noteCta: '',
        },
        whyItWorks: {
            eyebrow: 'Why it works',
            title: 'Why This Model Works',
            reasons: [
                {
                    title: 'Lower upfront risk',
                    description:
                        'You do not need to commit heavily before seeing the core system take shape.',
                },
                {
                    title: 'Faster validation',
                    description:
                        'Your team can confirm whether the workflow is right before moving to full production.',
                },
                {
                    title: 'Built around your workflow',
                    description:
                        'The system is shaped around how your business actually operates, not forced into generic software.',
                },
                {
                    title: 'Managed after launch',
                    description:
                        'Hosting, deployment, maintenance and monitoring can be handled under the production subscription.',
                },
            ],
        },
        faq: {
            eyebrow: 'Good to know',
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
                    answer: 'Kubis Forge manages hosting, infrastructure, deployment, maintenance and monitoring.',
                },
            ],
        },
        finalCta: {
            title: 'Need a Custom System for Your Business?',
            description:
                'Start with an MVP, validate the workflow, then move into production with a plan that grows with your business.',
            cta: "Let's Discuss Your Workflow",
            note: 'A direct conversation about what your business actually needs. No sales theater.',
        },
        footer: {
            description:
                'Custom business systems built around your workflow. Build first, subscribe when ready.',
            nav: {
                howItWorks: 'How It Works',
                pricing: 'Pricing',
                faq: 'FAQ',
                kubisApp: 'Kubis App',
            },
        },
    },
    ms: {
        hero: {
            badge: 'Sistem dalaman tersuai untuk perniagaan yang sedang berkembang',
            title: 'Bina Sistem Perniagaan Anda Dahulu. Langgan Hanya Apabila Ia Berfungsi.',
            description:
                'Kubis Forge membantu perniagaan menukar aliran kerja manual menjadi sistem dalaman tersuai. Kami bina MVP teras dahulu, sahkan bersama pasukan anda, kemudian pindahkan ke produksi di bawah langganan bulanan.',
            primaryCta: 'Tempah Panggilan Discovery',
            secondaryCta: 'Lihat Proses MVP',
            trustLine:
                'Tiada kos perisian permulaan yang besar · MVP dahulu · Langganan produksi kemudian',
            dashboardCta: 'Lihat projek saya',
            flow: ['Bina MVP', 'Sahkan aliran', 'Pindah ke produksi'],
        },
        painPoints: {
            eyebrow: 'Kedengaran biasa?',
            title: 'Masih menguruskan perniagaan dengan spreadsheet, WhatsApp dan susulan manual?',
            subtitle:
                'Forge direka untuk pasukan yang aliran kerja sebenar mereka tidak sesuai dengan alat siap pakai generik.',
            items: [
                {
                    title: 'Penjejakan stok dan pesanan berselerak',
                    description:
                        'Kuantiti tersebar di beberapa spreadsheet dan menjelang Jumaat tiada satu pun yang sepadan.',
                },
                {
                    title: 'Kelulusan bergantung pada mesej sembang',
                    description:
                        'Sebut harga atau permintaan tersadai dalam WhatsApp seseorang sehingga mereka teringat untuk membalas.',
                },
                {
                    title: 'Laporan mengambil masa berjam-jam',
                    description:
                        'Setiap bulan bermula dengan salin-tampal, formula dan harapan bahawa angka-angka itu sepadan.',
                },
                {
                    title: 'Alat sedia ada tidak sepadan dengan aliran kerja',
                    description:
                        'Anda terpaksa menyesuaikan proses dengan perisian, bukan sebaliknya.',
                },
            ],
        },
        idealClients: {
            eyebrow: 'Untuk siapa',
            title: 'Dibina untuk perniagaan yang melangkaui alat sedia ada',
            subtitle:
                'Kubis Forge sesuai untuk pasukan yang perlukan sistem dalaman tersuai tanpa kos perisian permulaan yang besar atau pasukan kejuruteraan dalaman.',
            clients: [
                'Perniagaan yang masih bergantung pada spreadsheet dan proses manual',
                'Perniagaan yang ada isu stok, pesanan, kelulusan, atau aliran kerja dalaman',
                'Pasukan yang perlukan sistem dalaman tersuai tanpa mengupah pembangun dalaman',
                'Pengasas yang mahu sistem berfungsi dahulu sebelum komitmen jangka panjang',
            ],
        },
        howItWorks: {
            eyebrow: 'Proses',
            title: 'Bagaimana Ia Berfungsi',
            subtitle:
                'Laluan tersusun daripada perbualan pertama hingga produksi, dalam empat langkah jelas.',
            steps: [
                {
                    number: '01',
                    title: 'Discovery',
                    description:
                        'Kami meneliti aliran kerja anda, masalah semasa dan hasil yang perlu dicapai oleh sistem.',
                },
                {
                    number: '02',
                    title: 'Pembangunan MVP',
                    description:
                        'Kami membangunkan sistem teras berdasarkan skop MVP yang dipersetujui. Anda boleh memantau kemajuan di staging dan memberi maklum balas.',
                },
                {
                    number: '03',
                    title: 'Pengesahan',
                    description:
                        'Anda menyemak MVP untuk memastikan ia memenuhi keperluan perniagaan dan sedia ke fasa seterusnya.',
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
            eyebrow: 'Skop MVP',
            title: 'Apa yang Diliputi Fasa MVP',
            subtitle:
                'Fasa MVP tertumpu pada pengesahan aliran kerja teras. Ia bukan persekitaran produksi penuh.',
            includedTitle: 'Termasuk dalam MVP',
            excludedTitle: 'Tersedia selepas MVP',
            includedNote: 'Semua yang diperlukan untuk mengesahkan proses utama',
            excludedNote: 'Dibuka apabila anda beralih ke langganan produksi',
            included: [
                'Aliran kerja teras sahaja',
                'UI asas',
                'Akses staging untuk semakan',
                'Skop yang tertumpu pada proses utama sehingga berfungsi',
            ],
            excluded: [
                'Hosting produksi',
                'Persediaan domain tersuai',
                'Integrasi pihak ketiga',
                'Modul baharu di luar skop yang dipersetujui',
                'Automasi lanjutan',
                'Pelaporan dan analitik',
            ],
        },
        pricing: {
            eyebrow: 'Pelan langganan',
            title: 'Harga mudah untuk sistem produksi',
            subtitle: 'Masuk ke produksi dengan pelan yang berkembang bersama perniagaan anda.',
            trustLine:
                'MVP dibina dahulu · Anda hanya melanggan apabila sistem sedia untuk produksi',
            cta: 'Mula Sekarang',
            monthLabel: '/bulan',
        },
        addOns: {
            eyebrow: 'Luaskan sistem anda',
            title: 'Add-On',
            subtitle: 'Luaskan sistem anda di luar skop langganan melalui add-on berasaskan skop.',
            optionalTitle: 'Add-On Pilihan',
            noteTitle: 'Ada permintaan yang tidak sesuai dengan pelan ini?',
            note: 'Forge juga boleh menyokong tugasan sekali sahaja untuk kerja khas atau ad-hoc, tanpa memerlukan langganan. Beritahu pasukan Kubis dalam thread projek anda.',
            noteCta: '',
        },
        whyItWorks: {
            eyebrow: 'Kenapa ia berkesan',
            title: 'Kenapa Model Ini Berkesan',
            reasons: [
                {
                    title: 'Risiko permulaan lebih rendah',
                    description:
                        'Anda tidak perlu membuat komitmen besar sebelum melihat sistem teras mula terbentuk.',
                },
                {
                    title: 'Pengesahan lebih cepat',
                    description:
                        'Pasukan anda boleh mengesahkan sama ada aliran kerja tersebut tepat sebelum bergerak ke produksi penuh.',
                },
                {
                    title: 'Dibina mengikut aliran kerja anda',
                    description:
                        'Sistem dibentuk mengikut cara sebenar perniagaan anda beroperasi, bukan dipaksa masuk ke perisian generik.',
                },
                {
                    title: 'Terurus selepas pelancaran',
                    description:
                        'Hosting, deployment, penyelenggaraan dan pemantauan boleh diuruskan di bawah langganan produksi.',
                },
            ],
        },
        faq: {
            eyebrow: 'Perlu tahu',
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
                    answer: 'Tidak. Staging hanya untuk ujian dan maklum balas. Operasi langsung memerlukan persediaan produksi di bawah langganan.',
                },
                {
                    question: 'Bolehkah kami minta integrasi?',
                    answer: 'Ya, tetapi integrasi diuruskan sebagai add-on dengan skop berasingan.',
                },
                {
                    question: 'Bagaimana harga add-on ditentukan?',
                    answer: 'Skop dan harga add-on ditentukan secara individu berdasarkan kerumitan dan keperluan. Hubungi kami untuk berbincang dan kami akan berikan pecahan kos sebelum sebarang kerja dimulakan.',
                },
                {
                    question:
                        'Bagaimana jika kami perlukan perubahan semasa dalam pelan Maintenance?',
                    answer: 'Perubahan kecil dan modul baharu tersedia sebagai add-on berasaskan skop. Anda kekal dalam pelan Maintenance dan hanya membayar untuk kerja yang diminta. Jika anda perlukan pembangunan bulanan yang berterusan, naik taraf ke Starter atau lebih tinggi adalah pilihan yang lebih sesuai.',
                },
                {
                    question: 'Apa yang berlaku jika kami hentikan langganan?',
                    answer: 'Hosting produksi dan perkhidmatan terurus mungkin akan digantung.',
                },
                {
                    question: 'Siapa yang mengurus server dan tetapan teknikal?',
                    answer: 'Kubis Forge mengurus hosting, infrastruktur, deployment, penyelenggaraan dan pemantauan.',
                },
            ],
        },
        finalCta: {
            title: 'Perlu Sistem Tersuai Untuk Perniagaan Anda?',
            description:
                'Mulakan dengan MVP, sahkan aliran kerja, kemudian masuk ke produksi dengan pelan yang berkembang bersama perniagaan anda.',
            cta: 'Jom Bincang Aliran Kerja Anda',
            note: 'Perbualan terus tentang perkara yang benar-benar diperlukan oleh perniagaan anda. Tanpa drama jualan.',
        },
        footer: {
            description:
                'Sistem perniagaan tersuai dibina mengikut aliran kerja anda. Bina dahulu, langgan apabila sedia.',
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
