"use client";

import { IconClock } from "@tabler/icons-react";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card";

export function SessionCard() {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Session</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    30 min
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    <IconClock className="size-4" />
                    Cookie lifetime
                </div>
                <div className="text-muted-foreground">
                    Access token expires after 30 minutes.
                </div>
            </CardFooter>
        </Card>
    );
}
