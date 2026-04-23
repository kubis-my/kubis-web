'use client';

import Link from 'next/link';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { Card, CardContent } from '@repo/shadcn-ui/components/card';
import {
    IconMapPin,
    IconBrandLinkedin,
    IconCode,
    IconRocket,
    IconBriefcase,
    IconExternalLink,
} from '@tabler/icons-react';

const stats = [
    { value: '5+', label: 'Years Experience' },
    { value: '8+', label: 'Projects Built' },
];

const skills: Record<string, { items: string[]; color: string }> = {
    Backend: {
        items: ['NestJS', 'Node.js', 'Laravel', '.NET (C#)', 'Microservices', 'REST APIs', 'GraphQL', 'WebSocket'],
        color: 'text-emerald-600 dark:text-emerald-400',
    },
    Database: {
        items: ['PostgreSQL', 'MySQL', 'Prisma', 'Redis'],
        color: 'text-blue-600 dark:text-blue-400',
    },
    'Cloud & DevOps': {
        items: ['Docker', 'CI/CD', 'CircleCI', 'AWS S3'],
        color: 'text-violet-600 dark:text-violet-400',
    },
    Frontend: {
        items: ['Next.js', 'Vue.js'],
        color: 'text-orange-600 dark:text-orange-400',
    },
    Integrations: {
        items: ['Google Maps API', 'Lark API', 'Gmail API'],
        color: 'text-rose-600 dark:text-rose-400',
    },
};

const projects = [
    {
        index: '01',
        name: 'TradeLink',
        label: 'Transportation Management System',
        description:
            'Multi-tenant TMS backend managing the full freight lifecycle load management, rate confirmations, invoicing, and bulk data import supporting up to 100K rows with real-time progress via WebSocket.',
        tech: ['NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'Socket.io', 'AWS S3'],
    },
    {
        index: '02',
        name: 'AutoCount + Lark',
        label: 'Integration',
        description:
            'Automated sync between AutoCount Agent and Lark dashboard, eliminating manual reporting through scheduled jobs and data transformation pipelines.',
        tech: ['.NET', 'C#', 'Lark API'],
    },
    {
        index: '03',
        name: 'Business Optimization System',
        label: 'Dashboard',
        description:
            'Real-time monitoring, reporting dashboards, and core modules for product, inventory, and order management with JWT-based auth.',
        tech: ['Next.js', 'Socket.io'],
    },
    {
        index: '04',
        name: 'BOS RESTful API',
        label: 'Backend API',
        description:
            'RESTful API with CRUD endpoints, Laravel Sanctum authentication, database queue handling, and courier service management.',
        tech: ['Laravel', 'MySQL'],
    },
    {
        index: '05',
        name: 'Business Optimization Messaging',
        label: 'Messaging & Real-Time',
        description:
            'WhatsApp automation for invoices and notifications with session management, real-time WebSocket, QR code delivery, and broadcast mechanisms.',
        tech: ['Node.js', 'Express', 'Socket.io', 'Prisma', 'MySQL'],
    },
    {
        index: '06',
        name: 'Sales Agent Management System',
        label: 'Management System',
        description:
            'Track agent performance, manage agents, and monitor sales activities with authentication, performance tracking, and async queue processing.',
        tech: ['Laravel', 'jQuery', 'MySQL'],
    }
];

export default function AuthorClient() {
    return (
        <div className="min-h-screen bg-[#ecf0f1] dark:bg-gray-950">
            <div className="mx-auto max-w-4xl px-6 py-20">

                {/* Hero */}
                <div className="mb-20">
                    <div className="flex flex-col items-center text-center">

                        {/* Avatar */}
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#4CAF50] to-teal-400 blur-lg opacity-40 scale-110" />
                            <div className="relative h-24 w-24 rounded-full bg-linear-to-br from-[#4CAF50] to-emerald-600 p-0.5 shadow-xl">
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#ecf0f1] dark:bg-gray-950">
                                    <span className="text-3xl font-bold text-[#4CAF50]">MZZ</span>
                                </div>
                            </div>
                        </div>

                        {/* Name & title */}
                        <div className="mb-2 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-3 py-1 text-xs font-medium text-[#4CAF50]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
                                Author of KUBIS
                            </span>
                        </div>
                        <h1 className="mb-2 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Zarkashi Zuakafli
                        </h1>
                        <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">
                            Full-Stack Developer
                        </p>

                        {/* Meta */}
                        <div className="mb-8 flex flex-wrap items-center justify-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <IconMapPin className="h-4 w-4 text-[#4CAF50]" />
                                Kelantan, Malaysia
                            </span>
                            <Link
                                href="https://linkedin.com/in/muhammad-zarkashi-zuakafli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 transition-colors hover:text-[#4CAF50]"
                            >
                                <IconBrandLinkedin className="h-4 w-4" />
                                LinkedIn
                                <IconExternalLink className="h-3 w-3 opacity-60" />
                            </Link>
                        </div>

                        {/* Bio */}
                        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                            Full-stack developer with 5+ years of experience specializing in backend systems,
                            API integrations, and scalable service architecture. I built KUBIS as a personal
                            project to explore microservices, workflow automation, and centralized auth. The
                            kind of platform I always wanted to use.
                        </p>

                        {/* Stats */}
                        <div className="grid w-full max-w-xs grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-5 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60"
                                >
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </div>
                                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Projects */}
                <section className="mb-16">
                    <div className="mb-5 flex items-center gap-2">
                        <IconRocket className="h-4 w-4 text-[#4CAF50]" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Projects
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {projects.map((project) => (
                            <Card
                                key={project.name}
                                className="group border-gray-200/80 bg-white/70 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs font-medium text-[#4CAF50]">
                                                    {project.index}
                                                </span>
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {project.name}
                                                </h3>
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {project.label}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mb-4 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                                        {project.description}
                                    </p>
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
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section className="mb-8">
                    <div className="mb-5 flex items-center gap-2">
                        <IconCode className="h-4 w-4 text-[#4CAF50]" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            Skills
                        </span>
                    </div>

                    <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {Object.entries(skills).map(([category, { items, color }]) => (
                                <div key={category}>
                                    <div className="mb-2.5 flex items-center gap-2">
                                        <IconBriefcase className={`h-3.5 w-3.5 ${color}`} />
                                        <span className={`text-xs font-semibold ${color}`}>
                                            {category}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {items.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="text-xs font-normal"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
