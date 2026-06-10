import { Badge } from '@repo/shadcn-ui/components/badge';
import {
    IconRocket,
    IconBolt,
    IconArrowRight,
    IconServer,
    IconDatabase,
    IconBuildingSkyscraper,
    IconPlugConnected,
    IconLayoutGrid,
    IconSettingsAutomation,
    type Icon,
} from '@tabler/icons-react';

type Project = {
    index: string;
    name: string;
    category: string;
    description: string;
    value: string;
    tech: string[];
};

const projects: Project[] = [
    {
        index: '01',
        name: 'TradeLink',
        category: 'Transportation Management',
        description:
            'Multi-tenant TMS backend managing load management, rate confirmations, invoicing, role-based access, PDF generation and AWS S3 storage.',
        value: 'Replaced manual load tracking with a real-time platform handling bulk imports up to 100K rows via WebSocket progress.',
        tech: ['NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'Socket.io', 'AWS S3', 'Puppeteer', "Google Maps API", "Sentry"],
    },
    {
        index: '02',
        name: 'AutoCount Agent',
        category: 'Integration',
        description:
            'Automated sync between AutoCount software and a Lark dashboard through scheduled jobs and data transformation pipelines.',
        value: 'Eliminated manual reporting by piping accounting data into live dashboards automatically.',
        tech: ['.NET', 'C#', 'Lark API'],
    },
    {
        index: '03',
        name: 'Business Optimization System',
        category: 'Operations Dashboard',
        description:
            'Real-time optimization platform with monitoring dashboards, operational reporting, RESTful services, middleware and async queue processing.',
        value: 'Gave operations a single real-time view instead of scattered, after-the-fact reports.',
        tech: ['Vue.js', 'Socket.io', 'Laravel', 'MySQL'],
    },
    {
        index: '04',
        name: 'POS Mobile & Web App',
        category: 'Point of Sale',
        description:
            'Full-stack POS for mobile and web covering transactions, inventory and sales workflows with real-time sync and JWT role access.',
        value: 'Unified in-store and online sales with synced inventory and instant receipt/invoice PDFs.',
        tech: ['Flutter', 'Vue.js', 'Laravel', 'MySQL'],
    },
    {
        index: '05',
        name: 'Business Optimization Messaging',
        category: 'Messaging & Real-Time',
        description:
            'WhatsApp automation for invoices and notifications with session management, real-time WebSocket, QR delivery, and broadcast mechanisms.',
        value: 'Automated invoice and notification delivery over WhatsApp at scale, hands-free.',
        tech: ['Node.js', 'Express', 'Socket.io', 'Prisma', 'MySQL'],
    },
    {
        index: '06',
        name: 'Sales Agent Management System',
        category: 'Management System',
        description:
            'Track agent performance, manage agents, and monitor sales activities with authentication and async queue processing.',
        value: 'Turned scattered agent performance data into one accountable dashboard.',
        tech: ['Vue.js', 'Laravel', 'MySQL'],
    },
    {
        index: '07',
        name: 'Vure',
        category: 'Open Source · SPA Starter',
        description:
            'Starter template supporting React and Vue with a Laravel backend, Tailwind CSS  and Bootstrap for rapid SPA development.',
        value: 'Cut SPA setup time with a batteries-included React/Vue + Laravel foundation.',
        tech: ['Laravel', 'TypeScript', 'React', 'Vue.js'],
    },
    {
        index: '08',
        name: 'Nolla',
        category: 'Open Source · Framework',
        description:
            'Laravel inspired Node.js framework built with TypeScript to simplify backend development workflows.',
        value: 'Helped Laravel developers move into Node.js with a familiar, structured framework.',
        tech: ['TypeScript', 'Node.js', 'Tailwind CSS'],
    },
];

type Capability = {
    icon: Icon;
    title: string;
    description: string;
    tech: string[];
};

const capabilities: Capability[] = [
    {
        icon: IconServer,
        title: 'Backend Architecture',
        description: 'Service layers, REST & GraphQL APIs and scalable architectures built to last.',
        tech: ['NestJS', 'Node.js', 'Laravel', '.NET (C#)', 'GraphQL', 'Microservices'],
    },
    {
        icon: IconDatabase,
        title: 'Database Design',
        description: 'Relational schema design, query performance and caching strategies.',
        tech: ['PostgreSQL', 'MySQL', 'Prisma ORM', 'Redis'],
    },
    {
        icon: IconBuildingSkyscraper,
        title: 'SaaS & Multi-tenancy',
        description: 'Tenant isolation, role-based access and authentication for production SaaS.',
        tech: ['Multi-tenant', 'RBAC', 'JWT', 'Data Isolation'],
    },
    {
        icon: IconRocket,
        title: 'DevOps & Deployment',
        description: 'Containerized deployments and automated build-and-ship pipelines.',
        tech: ['Docker', 'CI/CD', 'CircleCI', 'Fly.io', 'Digital Ocean', 'AWS S3'],
    },
    {
        icon: IconBolt,
        title: 'Real-time Systems',
        description: 'Live updates, message queues and async background processing.',
        tech: ['WebSocket', 'Socket.io', 'BullMQ', 'Redis'],
    },
    {
        icon: IconPlugConnected,
        title: 'Third-party Integrations',
        description: 'Wiring up external services, payment gateways and messaging providers.',
        tech: ['Google Maps API', 'Lark API', 'Gmail API', 'ToyyibPay', 'AutoCount', 'Baileys'],
    },
    {
        icon: IconLayoutGrid,
        title: 'Frontend Delivery',
        description: 'Responsive web and cross-platform mobile interfaces.',
        tech: ['Next.js', 'Vue.js', 'React', 'Flutter (Dart)', 'Tailwind CSS'],
    },
    {
        icon: IconSettingsAutomation,
        title: 'Automation & Tooling',
        description: 'PDF generation, scraping, testing and production monitoring.',
        tech: ['Puppeteer', 'Jest', 'Postman', 'Sentry', 'TypeScript'],
    },
];

export default function AuthorWork() {
    return (
        <section
            id="projects"
            className="scroll-mt-16 bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950"
        >
            <div className="mx-auto max-w-6xl">
                {/* Projects */}
                <div className="mb-5 flex items-center gap-2">
                    <IconRocket className="h-4 w-4 text-[#4CAF50]" />
                    <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                        Track record
                    </span>
                </div>
                <h2 className="mb-3 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                    Software I&apos;ve designed, built and shipped.
                </h2>
                <p className="mb-10 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    Real products with real users, from multi-tenant platforms to open-source
                    tooling.
                </p>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {projects.map((project) => (
                        <div
                            key={project.name}
                            className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4CAF50]/50 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/60"
                        >
                            <div className="pointer-events-none absolute -top-px -right-px h-24 w-24 rounded-bl-[3rem] bg-linear-to-bl from-[#4CAF50]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-medium text-[#4CAF50]">
                                        {project.index}
                                    </span>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                        {project.name}
                                    </h3>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="shrink-0 text-[10px] font-medium tracking-wide uppercase"
                                >
                                    {project.category}
                                </Badge>
                            </div>

                            <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {project.description}
                            </p>

                            <div className="mb-4 flex items-start gap-2 rounded-xl bg-[#4CAF50]/5 p-3">
                                <IconBolt className="mt-0.5 h-4 w-4 shrink-0 text-[#4CAF50]" />
                                <p className="text-xs leading-relaxed font-medium text-gray-700 dark:text-gray-300">
                                    {project.value}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {project.tech.map((t) => (
                                    <Badge
                                        key={t}
                                        variant="secondary"
                                        className="text-xs font-normal"
                                    >
                                        {t}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Capabilities */}
                <div className="mt-20 mb-5 flex items-center gap-2">
                    <IconArrowRight className="h-4 w-4 text-[#4CAF50]" />
                    <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                        Capabilities
                    </span>
                </div>
                <h2 className="mb-10 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                    What I bring to the table.
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {capabilities.map((cap) => (
                        <div
                            key={cap.title}
                            className="group rounded-2xl border border-gray-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4CAF50]/50 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/60"
                        >
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#4CAF50]/10 text-[#4CAF50] transition-colors group-hover:bg-[#4CAF50] group-hover:text-white">
                                <cap.icon className="h-5 w-5" />
                            </div>
                            <h3 className="mb-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                                {cap.title}
                            </h3>
                            <p className="mb-4 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                                {cap.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {cap.tech.map((t) => (
                                    <Badge
                                        key={t}
                                        variant="secondary"
                                        className="text-xs font-normal"
                                    >
                                        {t}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
