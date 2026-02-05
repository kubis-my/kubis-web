"use client";

import { TabsContent } from "@/shadcn/components/tabs";
import { useCompanyDetail } from "./company-detail-container";
import { UserColumn } from "./components/user-column";
import { UserSkeletonRow } from "./components/user-skeleton-row";
import { useCallback, useEffect, useState } from "react";
import { gql, TypedDocumentNode } from "@apollo/client";
import { PaginatedUserAccount, UserAccount, UserAccountPaginationInput } from "@repo/commons/types/account-service-schema.type";
import { useLazyQuery } from "@apollo/client/react";
import { USER_ACCOUNT_PAGINATION_SIZE } from "@/root/libs/constants";
import { createInitialPaginatedData } from "@repo/commons/utils/pagination-helpers";
import { DataTable } from "@repo/shadcn-ui/components/data-table";
import { useRouter } from "next/navigation";

interface GetUserAccountResponse {
    getCompanyUserAccounts: PaginatedUserAccount;
}

interface GetUserAccountVariables {
    pagination: UserAccountPaginationInput;
    companyPublicId: string
}

const GET_COMPANY_USER_ACCOUNTS: TypedDocumentNode<GetUserAccountResponse, GetUserAccountVariables> = gql`
    query GetCompanyUserAccounts($pagination:UserAccountPaginationInput!,$companyPublicId:String!) { 
        getCompanyUserAccounts(pagination:$pagination,companyPublicId:$companyPublicId){
            data {
                publicId
                status
                position
                joinedAt
                branchPublicId
                companyEmployee{
                    phoneCode
                    phoneNumber
                    internalId
                    user {
                        publicId
                        firstName
                        lastName
                        nickname
                    }
                }
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
`

export default function UsersTab() {
    const ctx = useCompanyDetail();
    const router = useRouter();
    const [GetCompanyUserAccounts, { data, loading }] = useLazyQuery(GET_COMPANY_USER_ACCOUNTS);

    const [pageSize, setPageSize] = useState(USER_ACCOUNT_PAGINATION_SIZE)
    const [paginatedUserAccount, setPaginatedUserAccount] = useState<PaginatedUserAccount>(createInitialPaginatedData())
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedUserAccount.pageInfo.hasNextPage && paginatedUserAccount.pageInfo.endCursor !== null) {
            setCursorHistory(prev => [...prev, paginatedUserAccount.pageInfo.endCursor]);
            GetCompanyUserAccounts({
                variables: {
                    companyPublicId: ctx.company?.publicId ?? "-1",
                    pagination: {
                        cursor: paginatedUserAccount.pageInfo.endCursor,
                        take: pageSize
                    }
                }
            });
        }
    }, [paginatedUserAccount, pageSize, GetCompanyUserAccounts]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            GetCompanyUserAccounts({
                variables: {
                    companyPublicId: ctx.company?.publicId ?? "-1",
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize
                    }
                }
            });
        }
    }, [cursorHistory, pageSize, GetCompanyUserAccounts]);

    const handleRowClick = useCallback((user: UserAccount) => {
        router.push(`/my-account/company/${ctx.company?.publicId}/user/${user.publicId}`);
    }, [router, ctx.company?.publicId]);

    useEffect(() => {
        setPaginatedUserAccount(data?.getCompanyUserAccounts ?? ctx.company?.userAccounts ?? createInitialPaginatedData())
    }, [ctx.company?.userAccounts, data?.getCompanyUserAccounts])

    return (
        <TabsContent value="users">
            <DataTable
                columns={UserColumn}
                data={paginatedUserAccount.data}
                pageInfo={paginatedUserAccount.pageInfo}
                isLoading={loading}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                cursorHistory={cursorHistory}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
                emptyMessage="No users found."
                getRowId={(row) => row.publicId.toString()}
                onRowClick={handleRowClick}
                renderSkeletonRow={() => <UserSkeletonRow />}
                flexColumnId="fullName"
            />
        </TabsContent>
    );
}
