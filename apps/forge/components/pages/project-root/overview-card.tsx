'use client';

import { IconBolt, IconLayoutGrid, IconStack, IconTargetArrow } from '@tabler/icons-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/card';
import { Skeleton } from '@/shadcn/components/skeleton';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { useProjects } from './projects-container';
import { Project, ProjectStatus } from '@repo/commons/types/forge-service-schema.type';

const ACTIVE_STATUSES: ProjectStatus[] = [
    ProjectStatus.DISCOVERY,
    ProjectStatus.MVP_BUILD,
    ProjectStatus.VALIDATION,
    ProjectStatus.PRODUCTION,
];

function getProjectSummary(projects: Project[]) {
    const planCount: Record<string, number> = {};

    projects.forEach((p) => {
        const plan = p.subscription?.plan?.name;
        if (plan) planCount[plan] = (planCount[plan] ?? 0) + 1;
    });

    return {
        total: projects.length,
        active: projects.filter((p) => ACTIVE_STATUSES.includes(p.status)).length,
        review: projects.filter((p) => p.status === ProjectStatus.PENDING_REVIEW).length,
        topPlan: Object.entries(planCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-',
    };
}

export function OverviewCard() {
    const ctx = useProjects();

    if (ctx.isFetchingProjects) {
        return (
            <>
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="aspect-video rounded-xl" />
            </>
        );
    }

    const summary = getProjectSummary(ctx.paginatedProjects?.data ?? []);

    return (
        <>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Projects</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {summary.total}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex items-center gap-2 font-medium">
                        <IconLayoutGrid className="size-4" />
                        All project streams
                    </div>
                    <div className="text-muted-foreground">Across every client engagement</div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Active Streams</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {summary.active}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex items-center gap-2 font-medium">
                        <IconBolt className="size-4" />
                        In motion now
                    </div>
                    <div className="text-muted-foreground">Discovery through production</div>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Pending Review</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {summary.review}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div
                        className={cn(
                            'line-clamp-1 flex items-center gap-2 font-medium',
                            summary.review > 0 && 'text-amber-600 dark:text-amber-400',
                        )}
                    >
                        <IconTargetArrow className="size-4" />
                        Awaiting sign-off
                    </div>
                    <div className="text-muted-foreground">
                        {summary.review > 0 ? 'Needs your attention' : 'Nothing waiting on you'}
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
