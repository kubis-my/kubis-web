'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import {
    Company,
    CompanyPaginationInput,
    PaginatedCompany,
} from '@repo/commons/types/account-service-schema.type';
import { useLazyQuery } from '@apollo/client/react';
import { useCallback, useEffect, useState } from 'react';
import { useCompany } from './company-container';
import { createInitialPaginatedData } from '@repo/commons/utils/pagination-helpers';
import { CompanyColumn } from './components/company-column';
import CompanySkeletonRow from './components/company-skeleton-row';
import { COMPANY_PAGINATION_SIZE } from '@/root/libs/constants';
import { gql, TypedDocumentNode } from '@apollo/client';

interface GetUserCompaniesResponse {
    getUserCompanies: PaginatedCompany;
}

interface GetUserCompaniesVariables {
    pagination: CompanyPaginationInput;
}

const GET_USER_COMPANIES: TypedDocumentNode<GetUserCompaniesResponse, GetUserCompaniesVariables> =
    gql`
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
            }
        }
    `;

export function CompanyDataTable() {
    const ctx = useCompany();
    const router = useRouter();
    const [getUserCompanies, { data, loading }] = useLazyQuery(GET_USER_COMPANIES);

    const [pageSize, setPageSize] = useState(COMPANY_PAGINATION_SIZE);
    const [paginatedCompany, setPaginatedCompany] = useState<Omit<PaginatedCompany, 'overview'>>(
        createInitialPaginatedData(),
    );
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedCompany.pageInfo.hasNextPage && paginatedCompany.pageInfo.endCursor !== null) {
            setCursorHistory((prev) => [...prev, paginatedCompany.pageInfo.endCursor]);
            getUserCompanies({
                variables: {
                    pagination: {
                        cursor: paginatedCompany.pageInfo.endCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [paginatedCompany, pageSize, getUserCompanies]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getUserCompanies({
                variables: {
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [cursorHistory, pageSize, getUserCompanies]);

    useEffect(() => {
        setPaginatedCompany(
            data?.getUserCompanies ?? ctx.paginatedCompany ?? createInitialPaginatedData(),
        );
    }, [ctx.paginatedCompany, data?.getUserCompanies]);

    const handleRowClick = (company: Company) => {
        router.push(`/my-account/company/${company.publicId}`);
    };

    return (
        <DataTable
            columns={CompanyColumn}
            data={paginatedCompany.data}
            pageInfo={paginatedCompany.pageInfo}
            isLoading={loading || ctx.isFetchingCompany}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            cursorHistory={cursorHistory}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            emptyMessage="No companies found."
            getRowId={(row) => row.publicId.toString()}
            onRowClick={handleRowClick}
            renderSkeletonRow={() => <CompanySkeletonRow />}
            flexColumnId="companyName"
        />
    );
}
