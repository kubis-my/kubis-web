"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/components/tabs";
import { Skeleton } from "@/shadcn/components/skeleton";
import { useCompanyBranchDetail } from "./company-branch-detail-container";
import UsersTab from "./users-tab";
import ActivityLogsTab from "./activity-logs-tab";
import AddUserDialog from "./add-user-dialog";

export default function TabContainer() {
    const ctx = useCompanyBranchDetail();
    const [activeTab, setActiveTab] = useState("users");

    if (ctx.loading) return <Skeleton className="min-h-screen flex-1 rounded-xl md:min-h-min" />

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    {activeTab === "users" && (
                        <AddUserDialog />
                    )}
                </div>
            </div>

            <UsersTab />
            <ActivityLogsTab />
        </Tabs>
    );
}

