'use client';

import { TabsContent } from '@/shadcn/components/tabs';
import { useCompanyBranchDetail } from './company-branch-detail-container';
import { useCallback, useEffect, useState } from 'react';
import { EventColumn } from './components/event-column';
import { EventSkeletonRow } from './components/event-skeleton-row';
import {
    BranchEvent,
    BranchEventPaginationInput,
    PaginatedBranchEvent,
} from '@repo/commons/types/account-service-schema.type';
import { BRANCH_EVENT_PAGINATION_SIZE } from '@/root/libs/constants';
import { createInitialPaginatedData } from '@repo/commons/utils/pagination-helpers';
import { useLazyQuery } from '@apollo/client/react';
import { gql, TypedDocumentNode } from '@apollo/client';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { useRouter } from 'next/navigation';

interface GetBranchEventResponse {
    getCompanyBranchEvent: PaginatedBranchEvent;
}

interface GetBranchEventVariables {
    pagination: BranchEventPaginationInput;
    companyPublicId: string;
}

const GET_COMPANY_BRANCH_EVENT: TypedDocumentNode<GetBranchEventResponse, GetBranchEventVariables> =
    gql`
        query GetCompanyBranchEvent(
            $pagination: BranchEventPaginationInput!
            $companyPublicId: String!
        ) {
            getCompanyBranchEvent(pagination: $pagination, companyPublicId: $companyPublicId) {
                data {
                    publicId
                    name
                    type
                    description
                    startDate
                    endDate
                    createdAt
                    updatedAt
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

export default function EventsTab() {
    const ctx = useCompanyBranchDetail();
    const router = useRouter();
    const [getCompanyBranchEvent, { data, loading }] = useLazyQuery(GET_COMPANY_BRANCH_EVENT);

    const [pageSize, setPageSize] = useState(BRANCH_EVENT_PAGINATION_SIZE);
    const [paginatedUserAccount, setPaginatedUserAccount] = useState<PaginatedBranchEvent>(
        createInitialPaginatedData(),
    );
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (
            paginatedUserAccount.pageInfo.hasNextPage &&
            paginatedUserAccount.pageInfo.endCursor !== null
        ) {
            setCursorHistory((prev) => [...prev, paginatedUserAccount.pageInfo.endCursor]);
            getCompanyBranchEvent({
                variables: {
                    companyPublicId: ctx.branch?.company.publicId ?? '-1',
                    pagination: {
                        cursor: paginatedUserAccount.pageInfo.endCursor,
                        take: pageSize,
                        branchPublicId: ctx.branch?.publicId ?? '-1',
                    },
                },
            });
        }
    }, [paginatedUserAccount, pageSize, getCompanyBranchEvent, ctx.branch]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getCompanyBranchEvent({
                variables: {
                    companyPublicId: ctx.branch?.company.publicId ?? '-1',
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                        branchPublicId: ctx.branch?.publicId ?? '-1',
                    },
                },
            });
        }
    }, [cursorHistory, pageSize, getCompanyBranchEvent, ctx.branch]);

    const handleRowClick = useCallback(
        (event: BranchEvent) => {
            router.push(
                `/my-account/company/${ctx.branch?.company.publicId}/branch/${ctx.branch?.publicId}/event/${event.publicId}`,
            );
        },
        [router, ctx.branch],
    );

    useEffect(() => {
        setPaginatedUserAccount(
            data?.getCompanyBranchEvent ?? ctx.branch?.branchEvents ?? createInitialPaginatedData(),
        );
    }, [ctx.branch?.userAccounts, data?.getCompanyBranchEvent]);

    return (
        <TabsContent value="events">
            <DataTable
                columns={EventColumn}
                data={paginatedUserAccount.data}
                pageInfo={paginatedUserAccount.pageInfo}
                isLoading={loading}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                cursorHistory={cursorHistory}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
                emptyMessage="No events found."
                getRowId={(row) => row.publicId.toString()}
                onRowClick={handleRowClick}
                renderSkeletonRow={() => <EventSkeletonRow />}
                flexColumnId="title"
            />
        </TabsContent>
    );
}
