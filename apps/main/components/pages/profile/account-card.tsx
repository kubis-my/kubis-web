"use client";

import { IconUser, IconMail } from "@tabler/icons-react";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card";
import { Skeleton } from "@/shadcn/components/skeleton";
import { useAuth } from "@/shadcn/providers/auth-provider";
import { useProfile } from "./profile-container";

export function AccountCard() {
    const { authUser } = useAuth();
    const { credential, isFetchingCredential } = useProfile();

    if (isFetchingCredential) return <Skeleton className="aspect-video rounded-xl" />

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Account</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {authUser?.displayName ?? "-"}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    <IconUser className="size-4" />
                    {authUser?.nickname ?? "-"}
                </div>
                <div className="text-muted-foreground flex items-center gap-1.5">
                    <IconMail className="size-4" />
                    {credential?.email ?? "-"}
                </div>
            </CardFooter>
        </Card>
    );
}
