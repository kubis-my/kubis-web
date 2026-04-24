'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { Company } from '@repo/commons/types/account-service-schema.type';

interface CompanyContextType {
    companyIndex: number;
    activeCompany: Company | undefined;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export function useCompany() {
    const ctx = useContext(CompanyContext);
    if (!ctx) throw new Error('useCompany must be used within CompanyProvider');
    return ctx;
}

export default function CompanyProvider({
    children,
    companyIndex,
}: {
    children: React.ReactNode;
    companyIndex: number;
}) {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();

    const companies = authUser?.companies ?? [];
    const activeCompany = companies[companyIndex] as Company | undefined;
    const isInvalid =
        !isLoading && (isNaN(companyIndex) || companyIndex < 0 || companyIndex >= companies.length);

    useEffect(() => {
        if (isInvalid) {
            router.replace('/c/0');
        }
    }, [isInvalid, router]);

    const value = useMemo(() => ({ companyIndex, activeCompany }), [companyIndex, activeCompany]);

    return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}
