"use client";

import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { CompanyPaginationInput, PaginatedCompany } from "@repo/commons/types/account-service-schema.type";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { COMPANY_PAGINATION_SIZE } from "@/root/libs/constants";
import CompanyHeaderAction from "./company-header-action";

interface GetUserCompaniesResponse {
    getUserCompanies: PaginatedCompany;
}

interface GetUserCompaniesVariables {
    pagination: CompanyPaginationInput;
}

const GET_USER_COMPANIES: TypedDocumentNode<GetUserCompaniesResponse, GetUserCompaniesVariables> = gql`
    query GetUserCompanies($pagination: CompanyPaginationInput!) {
        getUserCompanies(pagination: $pagination) {
            data {
                publicId
                name
                registrationNo
                logo
                isActive
                createdAt
                updatedAt
                totalActiveEmployee
                totalActiveBranch
            }
            pageInfo {
                endCursor
                hasNextPage
                total
                currentPage
                totalPages
            }
            overview {
                activeCompanies
                totalCompanies
                deactivatedCompanies
                companiesDeactivatedThisMonth
                retentionRate
                deactivationRate
                totalBranches
                newBranchesThisQuarter
                branchGrowthRate
                totalStaff
                newStaffThisQuarter
                staffGrowthRate
                averageStaffPerBranch
                newBranchesThisMonth
            }
        }
    }
`

export type CompanyContext = {
    paginatedCompany?: PaginatedCompany;
    isFetchingCompany: boolean;
}

const CompanyContext = createContext<CompanyContext | undefined>(undefined);

export default function CompanyContainer({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { updateBreadcrumbList, updateHeaderAction } = useDashboard01();

    const [paginatedCompany, setPaginatedCompany] = useState<PaginatedCompany | undefined>(undefined);

    const { data, loading: isFetchingCompany } = useQuery(GET_USER_COMPANIES, {
        variables: {
            pagination: {
                take: COMPANY_PAGINATION_SIZE
            }
        }
    });

    useEffect(() => {
        setPaginatedCompany(data?.getUserCompanies);
    }, [data]);

    useEffect(() => {
        updateBreadcrumbList([
            {
                name: "List of Companies"
            }
        ]);
        updateHeaderAction(CompanyHeaderAction)

        return () => {
            updateBreadcrumbList([]);
            updateHeaderAction(undefined);
        }
    }, [updateBreadcrumbList]);

    const contextValue = useMemo(() => ({
        paginatedCompany,
        isFetchingCompany,
    }), [paginatedCompany, isFetchingCompany]);

    return (
        <CompanyContext.Provider value={contextValue}>
            {children}
        </CompanyContext.Provider>
    )
}

export function useCompany() {
    const context = useContext(CompanyContext);
    if (context === undefined) {
        throw new Error('useCompany must be used within an CompanyProvider');
    }
    return context;
}