'use client';

import {
    IconArrowUpRight,
    IconBolt,
    IconFolderCode,
    IconLayoutGrid,
    IconPlus,
    IconStack,
    IconTargetArrow,
} from '@tabler/icons-react';
import { Button } from '@repo/shadcn-ui/components/button';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { Card, CardContent } from '@repo/shadcn-ui/components/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/shadcn/components/empty';
import { useProjects } from './projects-container';
import { type Project } from './types';
import { ProjectCard } from './project-card';
import { StatCard } from './stat-card';

function getProjectSummary(projects: Project[]) {
    const activeStatuses: Project['status'][] = [
        'Discovery',
        'MVP Build',
        'Validation',
        'Production',
    ];
    const planCount: Record<string, number> = {};

    projects.forEach((p) => {
        if (p.plan) planCount[p.plan] = (planCount[p.plan] ?? 0) + 1;
    });

    return {
        total: projects.length,
        active: projects.filter((p) => activeStatuses.includes(p.status)).length,
        review: projects.filter((p) => p.status === 'Pending Review').length,
        topPlan: Object.entries(planCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-',
    };
}

export default function ProjectsList() {
    const { projects, onOpenProject, onNewProject } = useProjects();
    const summary = getProjectSummary(projects);

    return (
        <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 -top-24 h-56 rounded-[38px] bg-linear-to-r to-transparent blur-2xl" />
            <div className="relative flex flex-col gap-4">
                {/* Hero */}
                <Card className="border-primary/30 bg-card/80 overflow-hidden rounded-3xl py-0 backdrop-blur-sm">
                    <div className="bg-primary/8 pointer-events-none absolute -top-8 -left-8 size-64 rounded-full blur-3xl" />
                    <div className="from-primary/25 to-primary/0 absolute inset-y-0 right-0 w-1/2 bg-linear-to-l" />
                    <CardContent className="relative p-5 md:p-7">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/12 text-primary border-primary/35 mb-3 gap-1.5 shadow-sm"
                                >
                                    <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#22c55e]" />
                                    Forge console
                                </Badge>
                                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                    Projects at a glance
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                                    Track active builds, client delivery lanes, and what needs
                                    review from one place.
                                </p>
                            </div>
                            <Button
                                className="group relative shrink-0 overflow-hidden rounded-xl border border-black/5 bg-neutral-950 px-5 py-5 text-[15px] font-semibold text-white shadow-[0_10px_28px_-14px_rgba(0,0,0,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_18px_34px_-14px_rgba(0,0,0,0.95)] active:translate-y-0 dark:border-white/15"
                                onClick={onNewProject}
                            >
                                <span className="absolute inset-0 bg-linear-to-r from-white/12 via-white/0 to-white/12 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <span className="relative mr-2.5 inline-flex size-5 items-center justify-center rounded-md bg-white/18 ring-1 ring-white/20 transition-transform duration-300 ring-inset group-hover:scale-105">
                                    <IconPlus className="size-3.5" />
                                </span>
                                <span className="relative">New Project</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    <StatCard
                        label="Total Projects"
                        value={summary.total}
                        sub="All your projects"
                        icon={<IconLayoutGrid className="size-4" />}
                        iconClass="text-violet-500 bg-violet-500/15"
                    />
                    <StatCard
                        label="Active Streams"
                        value={summary.active}
                        sub={
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <IconArrowUpRight className="size-3.5" />
                                In motion now
                            </span>
                        }
                        icon={<IconBolt className="size-4" />}
                        iconClass="text-emerald-500 bg-emerald-500/15"
                    />
                    <StatCard
                        label="Pending Review"
                        value={summary.review}
                        sub="Awaiting sign-off"
                        icon={<IconTargetArrow className="size-4" />}
                        iconClass="text-amber-500 bg-amber-500/15"
                        ring={summary.review > 0}
                    />
                    <StatCard
                        label="Top Plan"
                        value={summary.topPlan}
                        sub="Dominant subscription"
                        icon={<IconStack className="size-4" />}
                        iconClass="text-blue-500 bg-blue-500/15"
                    />
                </section>

                {/* Board */}
                <Card className="rounded-3xl py-0">
                    <CardContent className="p-5 md:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold">Project Board</h2>
                                <p className="text-muted-foreground mt-0.5 text-sm">
                                    Open a project card to continue work
                                </p>
                            </div>
                            <Badge variant="outline" className="rounded-full tabular-nums">
                                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            {projects.length === 0 ? (
                                <Empty className="col-span-full">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <IconFolderCode />
                                        </EmptyMedia>
                                        <EmptyTitle>No Projects Yet</EmptyTitle>
                                        <EmptyDescription>
                                            You haven&apos;t created any projects yet. Get started
                                            by creating your first project.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onOpen={() => onOpenProject(project.id)}
                                    />
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
