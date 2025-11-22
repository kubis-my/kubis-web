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

export default function TabContainer() {
    const ctx = useCompanyDetail();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("branches");

    if (ctx.isLoading.branches) return <Skeleton className="min-h-screen flex-1 rounded-xl md:min-h-min" />

    const handleAddBranch = () => {
        router.push(`/my-account/company/${ctx.company?.id}/branch/new`);
    };

    const handleAddUser = () => {
        router.push(`/my-account/company/${ctx.company?.id}/user/new`);
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="branches">Branches</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    {activeTab === "branches" && (
                        <Button variant="outline" size="sm" onClick={handleAddBranch}>
                            <IconPlus />
                            <span className="hidden lg:inline">Add Branch</span>
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
            <BranchesTab />
            <UsersTab />
        </Tabs>
    );
}

