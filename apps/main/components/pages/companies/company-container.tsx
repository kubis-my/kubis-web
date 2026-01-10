"use client";

import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { CompanyPaginationInput, PaginatedCompany } from "@repo/commons/types/account-service-schema.type";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";

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
                isUnclassified
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
    paginatedCompany: PaginatedCompany;
    isFetchingCompany: boolean;
    fetchCompanies: (pagination: CompanyPaginationInput) => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    setPageSize: (size: number) => void;
    pageSize: number;
    cursorHistory: (number | null | undefined)[]
}

const initialPaginatedCompany: PaginatedCompany = {
    data: [],
    pageInfo: {
        endCursor: null,
        hasNextPage: false,
        total: 0,
        currentPage: 1,
        totalPages: 1
    },
    overview: {
        totalCompanies: 0,
        activeCompanies: 0,
        deactivatedCompanies: 0,
        companiesDeactivatedThisMonth: 0,
        retentionRate: 0,
        deactivationRate: 0,
        totalBranches: 0,
        newBranchesThisQuarter: 0,
        branchGrowthRate: 0,
        totalStaff: 0,
        newStaffThisQuarter: 0,
        staffGrowthRate: 0,
        averageStaffPerBranch: 0,
        newBranchesThisMonth: 0,
    }
}

const CompanyContext = createContext<CompanyContext | undefined>(undefined);

export default function CompanyContainer({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { updateBreadcrumbList } = useDashboard01();
    const [getUserCompanies, { data, loading: isFetchingCompany }] = useLazyQuery(GET_USER_COMPANIES);
    const [pageSize, setPageSize] = useState(10);
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    // Fetch companies with pagination
    const fetchCompanies = useCallback((pagination: CompanyPaginationInput) => {
        getUserCompanies({
            variables: { pagination }
        });
    }, [getUserCompanies]);

    // Go to next page
    const goToNextPage = useCallback(() => {
        const currentData = data?.getUserCompanies;
        if (currentData?.pageInfo.hasNextPage && currentData.pageInfo.endCursor !== null) {
            // Save current cursor to history for back navigation
            setCursorHistory(prev => [...prev, currentData.pageInfo.endCursor]);
            fetchCompanies({
                cursor: currentData.pageInfo.endCursor,
                take: pageSize
            });
        }
    }, [data, pageSize, fetchCompanies]);

    // Go to previous page
    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            // Remove the last cursor and use the one before it
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            fetchCompanies({
                cursor: previousCursor,
                take: pageSize
            });
        }
    }, [cursorHistory, pageSize, fetchCompanies]);

    // Handle page size change
    const handleSetPageSize = useCallback((size: number) => {
        setPageSize(size);
        // Reset to first page when changing page size
        setCursorHistory([null]);
        fetchCompanies({ take: size });
    }, [fetchCompanies]);

    // Initial fetch
    useEffect(() => {
        fetchCompanies({ take: pageSize });
    }, []);

    useEffect(() => {
        updateBreadcrumbList([
            {
                name: "List of Companies"
            }
        ]);
    }, [updateBreadcrumbList]);

    const contextValue = useMemo(() => ({
        paginatedCompany: data?.getUserCompanies ?? initialPaginatedCompany,
        isFetchingCompany,
        fetchCompanies,
        goToNextPage,
        goToPreviousPage,
        setPageSize: handleSetPageSize,
        pageSize,
        cursorHistory
    }), [data, isFetchingCompany, fetchCompanies, goToNextPage, goToPreviousPage, handleSetPageSize, pageSize]);

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