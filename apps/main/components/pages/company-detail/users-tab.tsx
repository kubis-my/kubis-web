'use client';

import { TabsContent } from '@/shadcn/components/tabs';
import { useCompanyDetail } from './company-detail-container';
import { UserColumn } from './components/user-column';
import { UserSkeletonRow } from './components/user-skeleton-row';
import { useCallback, useEffect, useState } from 'react';
import { gql, TypedDocumentNode } from '@apollo/client';
import {
    CompanyEmployeePaginationInput,
    PaginatedCompanyEmployee,
} from '@repo/commons/types/account-service-schema.type';
import { useLazyQuery } from '@apollo/client/react';
import { COMPANY_EMPLOYEE_PAGINATION_SIZE } from '@/root/libs/constants';
import { createInitialPaginatedData } from '@repo/commons/utils/pagination-helpers';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { useRouter } from 'next/navigation';

interface GetCompanyEmployeesResponse {
    getCompanyEmployees: PaginatedCompanyEmployee;
}

interface GetCompanyEmployeesVariables {
    pagination: CompanyEmployeePaginationInput;
    companyPublicId: string;
}

const GET_COMPANY_EMPLOYEES: TypedDocumentNode<
    GetCompanyEmployeesResponse,
    GetCompanyEmployeesVariables
> = gql`
    query GetCompanyEmployees(
        $pagination: CompanyEmployeePaginationInput!
        $companyPublicId: String!
    ) {
        getCompanyEmployees(pagination: $pagination, companyPublicId: $companyPublicId) {
            data {
                publicId
                internalId
                phoneCode
                phoneNumber
                user {
                    publicId
                    firstName
                    lastName
                    nickname
                    credential {
                        email
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
`;

export default function UsersTab() {
    const ctx = useCompanyDetail();
    const router = useRouter();
    const [getCompanyEmployees, { data, loading }] = useLazyQuery(GET_COMPANY_EMPLOYEES);

    const [pageSize, setPageSize] = useState(COMPANY_EMPLOYEE_PAGINATION_SIZE);
    const [paginatedCompanyEmployee, setPaginatedCompanyEmployee] =
        useState<PaginatedCompanyEmployee>(createInitialPaginatedData());
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (
            paginatedCompanyEmployee.pageInfo.hasNextPage &&
            paginatedCompanyEmployee.pageInfo.endCursor !== null
        ) {
            setCursorHistory((prev) => [...prev, paginatedCompanyEmployee.pageInfo.endCursor]);
            getCompanyEmployees({
                variables: {
                    companyPublicId: ctx.company?.publicId ?? '-1',
                    pagination: {
                        cursor: paginatedCompanyEmployee.pageInfo.endCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [paginatedCompanyEmployee, pageSize, getCompanyEmployees]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getCompanyEmployees({
                variables: {
                    companyPublicId: ctx.company?.publicId ?? '-1',
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [cursorHistory, pageSize, getCompanyEmployees]);

    useEffect(() => {
        setPaginatedCompanyEmployee(
            data?.getCompanyEmployees ??
                ctx.company?.companyEmployees ??
                createInitialPaginatedData(),
        );
    }, [ctx.company?.companyEmployees, data?.getCompanyEmployees]);

    return (
        <TabsContent value="users">
            <DataTable
                columns={UserColumn}
                data={paginatedCompanyEmployee.data}
                pageInfo={paginatedCompanyEmployee.pageInfo}
                isLoading={loading}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                cursorHistory={cursorHistory}
                onNextPage={goToNextPage}
                onPreviousPage={goToPreviousPage}
                emptyMessage="No users found."
                getRowId={(row) => row.publicId.toString()}
                renderSkeletonRow={() => <UserSkeletonRow />}
                flexColumnId="fullName"
            />
        </TabsContent>
    );
}
