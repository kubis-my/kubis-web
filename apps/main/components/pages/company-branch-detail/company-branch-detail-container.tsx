"use client";

import { branchDataByCompany, branchSchema, companyData, companySchema, userDataByCompany, userSchema, eventDataByBranch, eventSchema, activityLogDataByBranch, activityLogSchema } from "@/root/libs/mock-up/company-data";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod"

export type IsLoadingType = {
    branchDetail: boolean
    users: boolean
    events: boolean
    activityLogs: boolean
}

export type CompanyBranchDetailContext = {
    company?: z.infer<typeof companySchema>
    branch?: z.infer<typeof branchSchema>
    users: z.infer<typeof userSchema>[]
    events: z.infer<typeof eventSchema>[]
    activityLogs: z.infer<typeof activityLogSchema>[]
    isLoading: IsLoadingType
}

const CompanyBranchDetailContext = createContext<CompanyBranchDetailContext | undefined>(undefined);

export default function CompanyBranchDetailContainer({ children, companyId, branchId }: Readonly<{ children: React.ReactNode, companyId: number, branchId: number }>) {
    const pathName = usePathname();

    const { updateBreadcrumbList } = useDashboard01();

    const [company, setCompany] = useState<z.infer<typeof companySchema> | undefined>(undefined);
    const [branch, setBranch] = useState<z.infer<typeof branchSchema> | undefined>(undefined);
    const [users, setUsers] = useState<z.infer<typeof userSchema>[]>([]);
    const [events, setEvents] = useState<z.infer<typeof eventSchema>[]>([]);
    const [activityLogs, setActivityLogs] = useState<z.infer<typeof activityLogSchema>[]>([]);
    const [isLoading, setIsLoading] = useState<IsLoadingType>({
        branchDetail: true,
        users: true,
        events: true,
        activityLogs: true,
    })

    const getCompanyBranchDetail = useCallback(async () => {
        // Simulate actual graphql api called
        await new Promise(res => setTimeout(() => res(true), 3000));

        const company = companyData.find(row => row.id === Number(companyId));

        if (!company) {
            return;
        }

        const branch = branchDataByCompany[company.id]?.find(row => row.id === branchId);

        if (!branch) {
            return;
        }

        // ['my-account', 'company', '1', 'branch', '101']
        const companyURL = pathName.split(new RegExp(/\//g))
            .filter(Boolean)
            .splice(0, 3)
            .join("/");

        updateBreadcrumbList([
            {
                name: company.companyName,
                url: "/" + companyURL
            },
            {
                name: branch.branchCode
            },
        ]);

        setCompany(company)
        setBranch(branch)
        setIsLoading(cur => ({
            ...cur,
            branchDetail: false
        }))
    }, [companyId, updateBreadcrumbList])

    const getUserList = useCallback(async () => {
        // Simulate actual graphql api called
        await new Promise(res => setTimeout(() => res(true), 3000));

        const companyUsers = userDataByCompany[Number(companyId)] || [];
        setUsers(companyUsers);

        setIsLoading(cur => ({
            ...cur,
            users: false
        }))
    }, [companyId])

    const getEventList = useCallback(async () => {
        // Simulate actual graphql api called
        await new Promise(res => setTimeout(() => res(true), 2000));

        const branchEvents = eventDataByBranch[Number(branchId)] || [];
        setEvents(branchEvents);

        setIsLoading(cur => ({
            ...cur,
            events: false
        }))
    }, [branchId])

    const getActivityLogs = useCallback(async () => {
        // Simulate actual graphql api called
        await new Promise(res => setTimeout(() => res(true), 2500));

        const branchActivityLogs = activityLogDataByBranch[Number(branchId)] || [];
        setActivityLogs(branchActivityLogs);

        setIsLoading(cur => ({
            ...cur,
            activityLogs: false
        }))
    }, [branchId])

    useEffect(() => {
        const fetchData = async () => {
            await getCompanyBranchDetail()
            await getUserList()
            await getEventList()
            await getActivityLogs()
        }

        fetchData()
    }, [getCompanyBranchDetail, getUserList, getEventList, getActivityLogs])

    const contextValue = useMemo(() => ({
        company,
        branch,
        users,
        events,
        activityLogs,
        isLoading
    }), [company, branch, users, events, activityLogs, isLoading]);

    return (
        <CompanyBranchDetailContext.Provider value={contextValue}>
            {children}
        </CompanyBranchDetailContext.Provider>
    )
}


export function useCompanyBranchDetail() {
    const context = useContext(CompanyBranchDetailContext);
    if (context === undefined) {
        throw new Error('useCompanyBranchDetail must be used within an CompanyBranchDetailProvider');
    }
    return context;
}
