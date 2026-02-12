"use client";

import { IconShieldCheck } from "@tabler/icons-react";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card";
import { Badge } from "@/shadcn/components/badge";
import { Skeleton } from "@/shadcn/components/skeleton";
import { useProfile } from "./profile-container";

export function SecurityCard() {
    const { credential, isFetchingCredential } = useProfile();

    const is2FAEnabled = credential?.isEnable2FA ?? false;

    if (isFetchingCredential) return <Skeleton className="aspect-video rounded-xl" />

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Security</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <Badge
                        variant="outline"
                        className={
                            is2FAEnabled
                                ? "border-green-600 text-green-600"
                                : "border-red-600 text-red-600"
                        }
                    >
                        2FA {is2FAEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    <IconShieldCheck className="size-4" />
                    Two-factor authentication{" "}
                    {is2FAEnabled ? "active" : "inactive"}
                </div>
                <div className="text-muted-foreground">
                    {is2FAEnabled
                        ? "All sessions are protected by 2FA."
                        : "Your sessions are not fully protected."}
                </div>
            </CardFooter>
        </Card>
    );
}
