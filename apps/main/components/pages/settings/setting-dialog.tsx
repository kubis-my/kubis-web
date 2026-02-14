'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shadcn/components/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/tabs';
import { useEffect, useState } from 'react';
import { IconUser, IconKey, IconShieldCheck } from '@tabler/icons-react';
import SettingDialogContent from './setting-dialog-content';
import ProfileContainer from './profile-container';

export const OPEN_SETTINGS_EVENT = 'open-settings-dialog';

export function openSettingsDialog() {
    window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}

export default function SettingDialog() {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('personal-information');

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener(OPEN_SETTINGS_EVENT, handler);
        return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler);
    }, []);

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);

                if (!value) {
                    setActiveTab('personal-information');
                }
            }}
        >
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
                <ProfileContainer>
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        orientation="vertical"
                        className="flex min-h-[500px]"
                    >
                        <div className="flex w-56 shrink-0 flex-col border-r p-4">
                            <div className="mb-4 px-2">
                                <DialogTitle>Settings</DialogTitle>
                                <DialogDescription className="mt-1 text-xs">
                                    Manage your account settings
                                </DialogDescription>
                            </div>
                            <TabsList className="flex w-full flex-col gap-1 bg-transparent">
                                <TabsTrigger
                                    value="personal-information"
                                    className="data-[state=active]:border-border justify-start gap-2 px-2 py-1.5 text-sm"
                                >
                                    <IconUser className="size-4" />
                                    Personal Information
                                </TabsTrigger>
                                <TabsTrigger
                                    value="credential"
                                    className="data-[state=active]:border-border justify-start gap-2 px-2 py-1.5 text-sm"
                                >
                                    <IconKey className="size-4" />
                                    Credential
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="data-[state=active]:border-border justify-start gap-2 px-2 py-1.5 text-sm"
                                >
                                    <IconShieldCheck className="size-4" />
                                    Security
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="flex flex-1 flex-col overflow-y-auto">
                            <SettingDialogContent activeTab={activeTab} />
                        </div>
                    </Tabs>
                </ProfileContainer>
            </DialogContent>
        </Dialog>
    );
}
