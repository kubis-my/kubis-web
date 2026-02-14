'use client';

import { TabsContent } from '@/shadcn/components/tabs';
import { useCompanyDetail } from './company-detail-container';
import {
    Branch,
    BranchPaginationInput,
    PaginatedBranch,
} from '@repo/commons/types/account-service-schema.type';
import { useCallback, useEffect, useState } from 'react';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import { BranchColumn } from './components/branch-column';
import { BranchSkeletonRow } from './components/branch-skeleton-row';
import { BRANCH_PAGINATION_SIZE } from '@/root/libs/constants';
import { createInitialPaginatedData } from '@repo/commons/utils/pagination-helpers';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { useRouter } from 'next/navigation';

interface GetUserCompaniesResponse {
    getCompanyBranches: PaginatedBranch;
}

interface GetUserCompaniesVariables {
    pagination: BranchPaginationInput;
    companyPublicId: string;
}

const GET_COMPANY_BRANCHES: TypedDocumentNode<GetUserCompaniesResponse, GetUserCompaniesVariables> =
    gql`
        query GetCompanyBranches($pagination: BranchPaginationInput!, $companyPublicId: String!) {
            getCompanyBranches(pagination: $pagination, companyPublicId: $companyPublicId) {
                data {
                    publicId
                    name
                    code
                    email
                    isActive
                    branchPhysicalAddresses {
                        city
                        state
                        country
                        phoneCode
                        phoneNumber
                    }
                    branchOperationHours {
                        dayOfWeek
                        openTime
                        closeTime
                        isClosed
                    }
                    totalOfEmployee
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

export default function BranchesTab() {
    const ctx = useCompanyDetail();
    const router = useRouter();
    const [getCompanyBranches, { data, loading }] = useLazyQuery(GET_COMPANY_BRANCHES);

    const [pageSize, setPageSize] = useState(BRANCH_PAGINATION_SIZE);
    const [paginatedBranch, setPaginatedBranch] = useState<PaginatedBranch>(
        createInitialPaginatedData(),
    );
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedBranch.pageInfo.hasNextPage && paginatedBranch.pageInfo.endCursor !== null) {
            setCursorHistory((prev) => [...prev, paginatedBranch.pageInfo.endCursor]);
            getCompanyBranches({
                variables: {
                    companyPublicId: ctx.company?.publicId ?? '-1',
                    pagination: {
                        cursor: paginatedBranch.pageInfo.endCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [paginatedBranch, pageSize, getCompanyBranches]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getCompanyBranches({
                variables: {
                    companyPublicId: ctx.company?.publicId ?? '-1',
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [cursorHistory, pageSize, getCompanyBranches]);

    const handleRowClick = useCallback(
        (branch: Branch) => {
            router.push(`/my-account/company/${ctx.company?.publicId}/branch/${branch.publicId}`);
        },
        [router, ctx.company?.publicId],
    );

    useEffect(() => {
        setPaginatedBranch(
            data?.getCompanyBranches ?? ctx.company?.branches ?? createInitialPaginatedData(),
        );
    }, [ctx.company?.branches, data?.getCompanyBranches]);

    return (
        <TabsContent value="branches">
            <DataTable
                columns={BranchColumn}
                data={paginatedBranch.data}
                pageInfo={paginatedBranch.pageInfo}
                isLoading={loading}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                cursorHistory={cursorHistory}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
                emptyMessage="No branches found."
                getRowId={(row) => row.publicId.toString()}
                onRowClick={handleRowClick}
                renderSkeletonRow={() => <BranchSkeletonRow />}
                flexColumnId="branchName"
            />
        </TabsContent>
    );
}
