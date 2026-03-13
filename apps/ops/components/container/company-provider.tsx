'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Branch, Company } from '@repo/commons/types/account-service-schema.type';

interface CompanyContextType {
    companyIndex: number;
    activeCompany: Company | undefined;
    activeBranch: Branch | undefined;
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
    const searchParams = useSearchParams();

    const companies = authUser?.companies ?? [];
    const activeCompany = companies[companyIndex] as Company | undefined;
    const isInvalid =
        !isLoading && (isNaN(companyIndex) || companyIndex < 0 || companyIndex >= companies.length);

    useEffect(() => {
        if (isInvalid) {
            router.replace('/c/0');
        }
    }, [isInvalid, router]);

    const branchPublicId = searchParams.get('branch') ?? undefined;

    const activeBranch = useMemo(() => {
        if (!branchPublicId || !authUser?.userAccounts) return undefined;
        return authUser.userAccounts.find((ua) => ua.branch.publicId === branchPublicId)?.branch;
    }, [branchPublicId, authUser?.userAccounts]);

    const value = useMemo(
        () => ({ companyIndex, activeCompany, activeBranch }),
        [companyIndex, activeCompany, activeBranch],
    );

    return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}
