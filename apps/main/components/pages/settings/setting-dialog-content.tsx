"use client";

import { Separator } from "@/shadcn/components/separator";
import PersonalInformationSection from "./components/personal-information-section";
import CredentialInformationSection from "./components/credential-information-section";
import SecurityInformationSection from "./components/security-information-section";

export default function SettingDialogContent({ activeTab }: { activeTab: string }) {
    const tabTitles: Record<string, string> = {
        "personal-information": "Personal Information",
        "credential": "Credential",
        "security": "Security",
    };

    return (
        <>
            <div className="p-6 pb-2">
                <h2 className="text-lg font-semibold">{tabTitles[activeTab]}</h2>
                <Separator className="mt-4" />
            </div>
            <div className="flex flex-1 flex-col p-6 pt-4">
                <PersonalInformationSection />
                <CredentialInformationSection />
                <SecurityInformationSection />
            </div>
        </>
    );
}
