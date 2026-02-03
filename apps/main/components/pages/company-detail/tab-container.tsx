"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/components/tabs";
import { useCompanyDetail } from "./company-detail-container";
import BranchesTab from "./branches-tab";
import { Skeleton } from "@/shadcn/components/skeleton";
import UsersTab from "./users-tab";
import { Button } from "@/shadcn/components/button";
import { IconPlus } from "@tabler/icons-react";
import ActivityLogsTab from "./activity-logs-tab";
import CreateBranchDialog from "./create-branch-dialog";

export default function TabContainer() {
    const ctx = useCompanyDetail();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("branches");

    if (ctx.isFetchingCompany) return <Skeleton className="min-h-screen flex-1 rounded-xl md:min-h-min" />

    const handleAddUser = () => {
        router.push(`/my-account/company/${ctx.company?.publicId}/user/new`);
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="branches">Branches</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    {activeTab === "branches" && (
                        <CreateBranchDialog />
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
            <BranchesTab />
            <UsersTab />
            <ActivityLogsTab />
        </Tabs>
    );
}

