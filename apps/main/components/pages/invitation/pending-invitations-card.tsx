"use client";

import { IconClock } from "@tabler/icons-react";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card";
import { Skeleton } from "@/shadcn/components/skeleton";
import { useInvitation } from "./invitation-container";

export function PendingInvitationsCard() {
    const { paginatedInvitation, isLoading } = useInvitation();

    if (isLoading) return <Skeleton className="aspect-video rounded-xl" />;

    const count = paginatedInvitation.overview.pendingCount;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Pending Invitations</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {count} {count === 1 ? "invitation" : "invitations"}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    <IconClock className="size-4" />
                    Awaiting your response
                </div>
                <div className="text-muted-foreground">
                    Review and respond to join
                </div>
            </CardFooter>
        </Card>
    );
}
