"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/components/tabs";
import PersonalInformationSection from "./personal-information-section";
import { TwoFactorAuthenticationSection, SessionPreferencesSection } from "./settings-section";

export default function ProfileTabContainer() {
    const [activeTab, setActiveTab] = useState("personal-information");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="personal-information">Personal Information</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="session">Session</TabsTrigger>
                </TabsList>
            </div>
            <PersonalInformationSection />
            <TwoFactorAuthenticationSection />
            <SessionPreferencesSection />
        </Tabs>
    );
}
