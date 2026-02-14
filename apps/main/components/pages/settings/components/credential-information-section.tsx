"use client";

import { Badge } from '@/shadcn/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/components/card'
import { Skeleton } from '@/shadcn/components/skeleton';
import { TabsContent } from '@/shadcn/components/tabs'
import { IconLock, IconMail } from '@tabler/icons-react';
import { useProfile } from '../profile-container';

export default function CredentialInformationSection() {
    const { credential, isFetchingCredential } = useProfile();

    if (isFetchingCredential) return <TabsContent value="credential" className="flex-1"><Skeleton className="h-full rounded-xl" /></TabsContent>

    return (
        <TabsContent value="credential" className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-semibold">
                                Email & Password
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Manage your email and password
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-col items-start gap-1.5 text-sm">
                    <div className="flex justify-between items-center border-b px-1 py-2">
                        <div className="flex items-center gap-2 font-medium text-sm">
                            <IconMail className="size-3.5 text-primary shrink-0" /> Email
                        </div>
                        <div className="text-muted-foreground text-xs">
                            {credential?.email ?? "-"}
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-1 py-2">
                        <div className="flex items-center gap-2 font-medium text-sm">
                            <IconLock className="size-3.5 shrink-0" /> Password
                        </div>
                        <div className="text-muted-foreground text-xs">
                            ••••••••
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
