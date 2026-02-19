'use client';

import { Badge } from '@/shadcn/components/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shadcn/components/card';
import { Skeleton } from '@/shadcn/components/skeleton';
import { TabsContent } from '@/shadcn/components/tabs';
import { IconUser } from '@tabler/icons-react';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useProfile } from '../profile-container';

export default function PersonalInformationSection() {
    const { authUser } = useAuth();
    const { isFetchingCredential } = useProfile();

    if (isFetchingCredential)
        return (
            <TabsContent value="personal-information" className="flex-1">
                <Skeleton className="h-full rounded-xl" />
            </TabsContent>
        );

    return (
        <TabsContent value="personal-information">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-semibold">Personal Information</CardTitle>
                            <CardDescription className="text-xs">
                                Manage your personal details
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-col items-start gap-1.5 text-sm">
                    <div className="flex items-center justify-between border-b px-1 py-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <IconUser className="text-primary size-3.5 shrink-0" /> First Name
                        </div>
                        <div className="text-muted-foreground text-xs">
                            {authUser?.firstName ?? '-'}
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-b px-1 py-2">
                        <div className="flex items-center gap-2 font-medium">
                            <IconUser className="size-3.5 shrink-0" /> Last Name
                        </div>
                        <div className="text-muted-foreground text-xs">
                            {authUser?.lastName ?? '-'}
                        </div>
                    </div>
                    <div className="flex items-center justify-between px-1 py-2">
                        <div className="flex items-center gap-2 font-medium">
                            <IconUser className="size-3.5 shrink-0" /> Nickname
                        </div>
                        <div className="text-muted-foreground text-xs">
                            {authUser?.nickname ?? '-'}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
