"use client";

import { ROUTE } from "@/root/libs/constants";
import { branchDataByCompany, branchSchema, companyData, companySchema, userDataByCompany, userSchema } from "@/root/libs/mock-up/company-data";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod"

export type IsLoadingType = {
    companyDetail: boolean
    branches: boolean
    users: boolean
}

export type CompanyDetailContext = {
    company?: z.infer<typeof companySchema>
    branches: z.infer<typeof branchSchema>[]
    users: z.infer<typeof userSchema>[]
    isLoading: IsLoadingType
}

const CompanyDetailContext = createContext<CompanyDetailContext | undefined>(undefined);

export default function CompanyDetailContainer({ children, id }: Readonly<{ children: React.ReactNode, id: number }>) {
    const { updateBreadcrumbList } = useDashboard01();

    const [company, setCompany] = useState<z.infer<typeof companySchema> | undefined>(undefined);
    const [branches, setBranches] = useState<z.infer<typeof branchSchema>[]>([]);
    const [users, setUsers] = useState<z.infer<typeof userSchema>[]>([]);
    const [isLoading, setIsLoading] = useState<IsLoadingType>({
        companyDetail: true,
        branches: true,
        users: true,
    })

    const getCompanyDetail = useCallback(async () => {
        // Simulate actual graphql api called
        await new Promise(res => setTimeout(() => res(true), 3000));

        const company = companyData.find(row => row.id === Number(id));

        if (!company) {
            return;
        }

        updateBreadcrumbList([
            {
                name: "Company",
                url: ROUTE.MY_ACCOUNT.COMPANY
            },
            {
                name: company.companyName
            },
        ]);

        setCompany(company)
        setIsLoading(cur => ({
            ...cur,
            companyDetail: false
        }))
    }, [id, updateBreadcrumbList])

    const getBranchList = useCallback(async () => {
        // Simulate actual graphql api called
        await new Promise(res => setTimeout(() => res(true), 3000));

        const companyBranches = branchDataByCompany[Number(id)] || [];
        setBranches(companyBranches);

        setIsLoading(cur => ({
            ...cur,
            branches: false
        }))
    }, [id])

    const getUserList = useCallback(async () => {
        // Simulate actual graphql api called
        await new Promise(res => setTimeout(() => res(true), 3000));

        const companyUsers = userDataByCompany[Number(id)] || [];
        setUsers(companyUsers);

        setIsLoading(cur => ({
            ...cur,
            users: false
        }))
    }, [id])

    useEffect(() => {
        const fetchData = async () => {
            await getCompanyDetail()
            await getBranchList()
            await getUserList()
        }

        fetchData()
    }, [getCompanyDetail, getBranchList, getUserList])

    const contextValue = useMemo(() => ({
        company,
        branches,
        users,
        isLoading
    }), [company, branches, users, isLoading]);

    return (
        <CompanyDetailContext.Provider value={contextValue}>
            {children}
        </CompanyDetailContext.Provider>
    )
}


export function useCompanyDetail() {
    const context = useContext(CompanyDetailContext);
    if (context === undefined) {
        throw new Error('useCompanyDetail must be used within an CompanyDetailProvider');
    }
    return context;
}
