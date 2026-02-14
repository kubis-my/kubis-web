"use client";

import { Badge } from '@/shadcn/components/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/components/card'
import { Label } from '@/shadcn/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/select'
import { Skeleton } from '@/shadcn/components/skeleton'
import { Switch } from '@/shadcn/components/switch'
import { TabsContent } from '@/shadcn/components/tabs'
import { useProfile } from '../profile-container';

export default function SecurityInformationSection() {
    const { credential, isFetchingCredential } = useProfile();

    if (isFetchingCredential) return <TabsContent value="security" className="flex-1"><Skeleton className="h-full rounded-xl" /></TabsContent>

    return (
        <TabsContent value="security" className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-semibold">
                                Two-Factor Authentication
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Add an extra layer of security to your account
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="cursor-not-allowed text-muted-foreground">
                                Enable 2FA
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Require a verification code when signing in
                            </p>
                        </div>
                        <Switch
                            checked={credential?.isEnable2FA ?? false}
                            disabled
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-semibold">
                                Session Preferences
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Configure your session timeout settings
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="cursor-not-allowed text-muted-foreground">
                                Session Timeout
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                How long before your session expires
                            </p>
                        </div>
                        <Select defaultValue="30" disabled>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
