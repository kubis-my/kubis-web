'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { Skeleton } from '@/shadcn/components/skeleton';
import { INVITATION_PAGINATION_SIZE } from '@/root/libs/constants';
import { useInvitation } from './invitation-container';
import { createInvitationColumns } from './components/invitation-column';
import { InvitationSkeletonRow } from './components/invitation-skeleton-row';
import {
    CredentialInvitationPaginationInput,
    PaginatedCredentialInvitation,
} from '@repo/commons/types/account-service-schema.type';
import { createInitialPaginatedData } from '@repo/commons/utils/pagination-helpers';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';

interface GetCredentialInvitationResponse {
    getCredentialInvitations: PaginatedCredentialInvitation;
}

interface GetCredentialInvitationVariables {
    pagination: CredentialInvitationPaginationInput;
}

const GET_CREDENTIAL_INVITATION: TypedDocumentNode<
    GetCredentialInvitationResponse,
    GetCredentialInvitationVariables
> = gql`
    query GetCredentialInvitations($pagination: CredentialInvitationPaginationInput!) {
        getCredentialInvitations(pagination: $pagination) {
            data {
                publicId
                status
                position
                companyEmployee {
                    user {
                        publicId
                    }
                    company {
                        name
                    }
                }
                branch {
                    name
                    code
                }
                createdBy {
                    publicId
                    firstName
                    credential {
                        email
                    }
                }
                createdAt
                expiredAt
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

export default function InvitationTable() {
    const ctx = useInvitation();
    const [getCredentialInvitations, { data, loading }] = useLazyQuery(GET_CREDENTIAL_INVITATION);

    const [pageSize, setPageSize] = useState(INVITATION_PAGINATION_SIZE);
    const [paginatedInvitation, setPaginatedInvitation] = useState<
        Omit<PaginatedCredentialInvitation, 'overview'>
    >(createInitialPaginatedData());
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const columns = useMemo(
        () => createInvitationColumns(ctx.acceptInvitation, ctx.declineInvitation),
        [ctx.acceptInvitation, ctx.declineInvitation],
    );

    const goToNextPage = useCallback(() => {
        if (
            paginatedInvitation.pageInfo.hasNextPage &&
            paginatedInvitation.pageInfo.endCursor !== null
        ) {
            setCursorHistory((prev) => [...prev, paginatedInvitation.pageInfo.endCursor]);
            getCredentialInvitations({
                variables: {
                    pagination: {
                        cursor: paginatedInvitation.pageInfo.endCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [paginatedInvitation, pageSize, getCredentialInvitations]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getCredentialInvitations({
                variables: {
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [cursorHistory, pageSize, getCredentialInvitations]);

    useEffect(() => {
        setPaginatedInvitation(
            data?.getCredentialInvitations ??
                ctx.paginatedInvitation ??
                createInitialPaginatedData(),
        );
    }, [ctx.paginatedInvitation, data?.getCredentialInvitations]);

    if (ctx.isLoading) return <Skeleton className="min-h-screen flex-1 rounded-xl md:min-h-min" />;

    return (
        <DataTable
            columns={columns}
            data={paginatedInvitation.data}
            pageInfo={paginatedInvitation.pageInfo}
            isLoading={loading}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            cursorHistory={cursorHistory}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            emptyMessage="No invitations found."
            getRowId={(row) => row.publicId}
            renderSkeletonRow={() => <InvitationSkeletonRow />}
            flexColumnId="companyName"
        />
    );
}
