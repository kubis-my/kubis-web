'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { useParams, useRouter } from 'next/navigation';
import { ROUTE } from '@/root/libs/constants';

type ProjectForm = {
    name: string;
    background: string;
    problem: string;
    systemNeeds: string;
    references: string;
    expectedUsers: string;
    notes: string;
};

type NewProjectContextType = {
    form: ProjectForm;
    onChange: (field: keyof ProjectForm, value: string) => void;
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
    const params = useParams();
    const router = useRouter();
    const companyIndex = Number(params?.companyIndex ?? 0);

    const { updateBreadcrumbList, updateHeaderAction } = useDashboard01();

    const [form, setForm] = useState<ProjectForm>({
        name: '',
        background: '',
        problem: '',
        systemNeeds: '',
        references: '',
        expectedUsers: '',
        notes: '',
    });

    useEffect(() => {
        updateBreadcrumbList([
            { name: 'Projects', url: ROUTE.FORGE.PROJECTS(companyIndex) },
            { name: 'New Project' },
        ]);
        updateHeaderAction(undefined);

        return () => {
            updateBreadcrumbList([]);
        };
    }, [companyIndex, updateBreadcrumbList, updateHeaderAction]);

    function onChange(field: keyof ProjectForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function onSubmit() {
        router.push(ROUTE.FORGE.PROJECT_DETAIL(companyIndex, '1'));
    }

    return (
        <NewProjectContext.Provider value={{ form, onChange, onSubmit }}>
            {children}
        </NewProjectContext.Provider>
    );
}
