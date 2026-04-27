'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { Company } from '@repo/commons/types/account-service-schema.type';
import { ROUTE } from '@/root/libs/constants';

type ProjectForm = {
    name: string;
    background: string;
    problem: string;
    systemNeeds: string;
    references: string;
    expectedUsers: string;
    notes: string;
    companyIds: string[];
};

type NewProjectContextType = {
    form: ProjectForm;
    availableCompanies: Company[];
    onChange: (field: keyof Omit<ProjectForm, 'companyIds'>, value: string) => void;
    onToggleCompany: (publicId: string) => void;
    onSubmit: () => void;
};

const NewProjectContext = createContext<NewProjectContextType | undefined>(undefined);

export function useNewProject() {
    const context = useContext(NewProjectContext);

    if (context === undefined) {
        throw new Error('useNewProject must be used within a NewProjectContainer');
    }

    return context;
}

export default function NewProjectContainer({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const { authUser } = useAuth();

    const availableCompanies = (authUser?.companies ?? []) as Company[];

    const [form, setForm] = useState<ProjectForm>({
        name: '',
        background: '',
        problem: '',
        systemNeeds: '',
        references: '',
        expectedUsers: '',
        notes: '',
        companyIds: [],
    });

    function onChange(field: keyof Omit<ProjectForm, 'companyIds'>, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function onToggleCompany(publicId: string) {
        setForm((prev) => {
            const already = prev.companyIds.includes(publicId);

            return {
                ...prev,
                companyIds: already
                    ? prev.companyIds.filter((id) => id !== publicId)
                    : [...prev.companyIds, publicId],
            };
        });
    }

    function onSubmit() {
        router.push(ROUTE.FORGE.PROJECT_DETAIL('1'));
    }

    return (
        <NewProjectContext.Provider value={{ form, availableCompanies, onChange, onToggleCompany, onSubmit }}>
            {children}
        </NewProjectContext.Provider>
    );
}
