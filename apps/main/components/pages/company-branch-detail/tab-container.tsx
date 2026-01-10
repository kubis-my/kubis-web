"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/components/tabs";
import { Skeleton } from "@/shadcn/components/skeleton";
import { Button } from "@/shadcn/components/button";
import { IconPlus } from "@tabler/icons-react";
import { useCompanyBranchDetail } from "./company-branch-detail-container";
import UsersTab from "./users-tab";
import EventsTab from "./events-tab";
import SettingsTab from "./settings-tab";
import ActivityLogsTab from "./activity-logs-tab";

export default function TabContainer() {
    const ctx = useCompanyBranchDetail();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("users");

    if (ctx.loading) return <Skeleton className="min-h-screen flex-1 rounded-xl md:min-h-min" />

    const handleAddEvent = () => {
        router.push(`/my-account/company/${ctx.branch?.company.publicId}/branch/${ctx.branch?.publicId}/event/new`);
    };

    const handleAddUser = () => {
        router.push(`/my-account/company/${ctx.branch?.company.publicId}/branch/${ctx.branch?.publicId}/user/new`);
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    {activeTab === "events" && (
                        <Button variant="outline" size="sm" onClick={handleAddEvent}>
                            <IconPlus />
                            <span className="hidden lg:inline">Add Event</span>
                        </Button>
                    )}
                    {activeTab === "users" && (
                        <Button variant="outline" size="sm" onClick={handleAddUser}>
                            <IconPlus />
                            <span className="hidden lg:inline">Add User</span>
                        </Button>
                    )}
                    {/* Settings tab doesn't need an add button */}
                </div>
            </div>

            <UsersTab />
            <EventsTab />
            <ActivityLogsTab />
            <SettingsTab />
        </Tabs>
    );
}

