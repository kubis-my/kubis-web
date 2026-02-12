"use client";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/shadcn/components/card";
import { TabsContent } from "@/shadcn/components/tabs";
import { Badge } from "@/shadcn/components/badge";
import { Switch } from "@/shadcn/components/switch";
import { Label } from "@/shadcn/components/label";
import { IconMail, IconLock } from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/select";
import { useProfile } from "./profile-container";

export function TwoFactorAuthenticationSection() {
    const { credential } = useProfile();

    const is2FAEnabled = credential?.isEnable2FA ?? false;

    return (
        <TabsContent value="security" className="space-y-4">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-semibold">
                            Credential
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
                        checked={is2FAEnabled}
                        disabled
                    />
                </div>
            </CardContent>
        </Card>
        </TabsContent>
    );
}

export function SessionPreferencesSection() {
    return (
        <TabsContent value="session">
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
                        <SelectTrigger className="w-[160px]">
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
    );
}
