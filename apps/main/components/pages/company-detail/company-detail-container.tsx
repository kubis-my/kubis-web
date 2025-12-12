"use client";

import { ROUTE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { useGetCompanyDetail } from "@repo/commons/hooks/use-graphql-company";
import { Company } from "@repo/commons/types/account-service-schema.type";
import { createContext, useContext, useEffect, useMemo, useState } from "react";


export type CompanyDetailContext = {
    company?: Company
    isFetchingCompany: boolean
}

const CompanyDetailContext = createContext<CompanyDetailContext | undefined>(undefined);

export default function CompanyDetailContainer({ children, id }: Readonly<{ children: React.ReactNode, id: string }>) {
    const { updateBreadcrumbList } = useDashboard01();
    const { data, loading: isFetchingCompany } = useGetCompanyDetail({
        companyPublicId: id,
        branchPaginationInput: {
            take: 10
        },
        userAccountPaginationInput: {
            take: 10
        }
    })

    const [company, setCompany] = useState<Company | undefined>(undefined);

    useEffect(() => {
        setCompany(data?.getCompanyDetail)

        if (data?.getCompanyDetail) {
            updateBreadcrumbList([
                {
                    name: "Company",
                    url: ROUTE.MY_ACCOUNT.COMPANY
                },
                {
                    name: data.getCompanyDetail.name
                },
            ]);
        }
    }, [data])

    const contextValue = useMemo(() => ({
        company,
        isFetchingCompany,
    }), [company, isFetchingCompany]);

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
