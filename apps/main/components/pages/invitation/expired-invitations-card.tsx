'use client';

import { IconAlertCircle } from '@tabler/icons-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/card';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useInvitation } from './invitation-container';

export function ExpiredInvitationsCard() {
    const { paginatedInvitation, isLoading } = useInvitation();

    if (isLoading) return <Skeleton className="aspect-video rounded-xl" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Expired Invitations</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {paginatedInvitation?.overview?.expiredCount ?? 0}{' '}
                    {paginatedInvitation?.overview?.expiredCount === 1
                        ? 'invitation'
                        : 'invitations'}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    <IconAlertCircle className="size-4" />
                    No longer available
                </div>
                <div className="text-muted-foreground">Invitations have expired</div>
            </CardFooter>
        </Card>
    );
}
