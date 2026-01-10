"use client";

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@repo/shadcn-ui/components/button";
import { Label } from "@repo/shadcn-ui/components/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/shadcn-ui/components/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/shadcn-ui/components/table";
import {
    IconChevronLeft,
    IconChevronRight,
} from "@tabler/icons-react";
import { TabsContent } from "@/shadcn/components/tabs";
import { useCompanyBranchDetail } from "./company-branch-detail-container";
import { useCallback, useEffect, useState } from "react";
import { UserColumn } from "./components/user-column";
import UserRow from "./components/user-row";
import { gql, TypedDocumentNode } from "@apollo/client";
import { PaginatedUserAccount, UserAccountPaginationInput } from "@repo/commons/types/account-service-schema.type";
import { useLazyQuery } from "@apollo/client/react";
import { UserSkeletonRow } from "./components/user-skeleton-row";
import { USER_ACCOUNT_PAGINATION_SIZE } from "@/root/libs/constants";

interface GetUserAccountResponse {
    getCompanyUserAccounts: PaginatedUserAccount;
}

interface GetUserAccountVariables {
    pagination: UserAccountPaginationInput;
    companyPublicId: string;
}

const GET_COMPANY_BRANCH_USER_ACCOUNTS: TypedDocumentNode<GetUserAccountResponse, GetUserAccountVariables> = gql`
    query GetCompanyUserAccounts($pagination:UserAccountPaginationInput!,$companyPublicId:String!) {
        getCompanyUserAccounts(pagination:$pagination,companyPublicId:$companyPublicId){
            data {
                publicId
                status
                joinedAt
                branchPublicId
                companyEmployee{
                    phoneCode
                    phoneNumber
                    position
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

const initialPaginatedUserAccount: PaginatedUserAccount = {
    data: [],
    pageInfo: {
        endCursor: null,
        hasNextPage: false,
        total: 0,
        currentPage: 1,
        totalPages: 1
    },
}

export default function UsersTab() {
    const ctx = useCompanyBranchDetail();
    const [getCompanyUserAccounts, { data, loading }] = useLazyQuery(GET_COMPANY_BRANCH_USER_ACCOUNTS);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageSize, setPageSize] = useState(USER_ACCOUNT_PAGINATION_SIZE);
    const [paginatedUserAccount, setPaginatedUserAccount] = useState<PaginatedUserAccount>(initialPaginatedUserAccount);
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedUserAccount.pageInfo.hasNextPage && paginatedUserAccount.pageInfo.endCursor !== null) {
            setCursorHistory(prev => [...prev, paginatedUserAccount.pageInfo.endCursor]);
            getCompanyUserAccounts({
                variables: {
                    companyPublicId: ctx.branch?.company.publicId ?? "-1",
                    pagination: {
                        cursor: paginatedUserAccount.pageInfo.endCursor,
                        take: pageSize,
                        branchPublicId: ctx.branch?.publicId ?? "-1",
                    }
                }
            });
        }
    }, [paginatedUserAccount, pageSize, getCompanyUserAccounts, ctx.branch]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getCompanyUserAccounts({
                variables: {
                    companyPublicId: ctx.branch?.company.publicId ?? "-1",
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                        branchPublicId: ctx.branch?.publicId ?? "-1",
                    }
                }
            });
        }
    }, [cursorHistory, pageSize, getCompanyUserAccounts, ctx.branch]);

    const table = useReactTable({
        data: paginatedUserAccount.data,
        columns: UserColumn,
        state: {
            sorting,
        },
        getRowId: (row) => row.publicId.toString(),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: paginatedUserAccount.pageInfo.totalPages,
    });

    useEffect(() => {
        setPaginatedUserAccount(data?.getCompanyUserAccounts ?? ctx.branch?.userAccounts ?? initialPaginatedUserAccount)
    }, [ctx.branch?.userAccounts, data?.getCompanyUserAccounts])

    return (
        <TabsContent value="users">
            <div className="flex w-full flex-col gap-4">
                <div className="overflow-hidden rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                className="px-5 py-2"
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                style={{
                                                    width:
                                                        header.column.id === "fullName"
                                                            ? "auto"
                                                            : `${header.getSize()}px`,
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: pageSize }).map((_, index) => (
                                    <UserSkeletonRow key={`skeleton-${index}`} />
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <UserRow
                                        key={row.id}
                                        row={row}
                                        companyId={ctx.branch?.company.publicId ?? "-1"}
                                        branchId={ctx.branch?.publicId ?? "-1"}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={UserColumn.length}
                                        className="h-24 text-center"
                                    >
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between px-4">
                    {/* Left: Showing count */}
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium text-foreground">
                            {paginatedUserAccount.pageInfo.total === 0
                                ? 0
                                : (cursorHistory.length - 1) * pageSize + 1}
                        </span>
                        {" - "}
                        <span className="font-medium text-foreground">
                            {Math.min(
                                cursorHistory.length * pageSize,
                                paginatedUserAccount.pageInfo.total
                            )}
                        </span>
                        {" of "}
                        <span className="font-medium text-foreground">
                            {paginatedUserAccount.pageInfo.total}
                        </span>
                    </div>

                    {/* Center: Pagination controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={goToPreviousPage}
                            disabled={cursorHistory.length === 1 || loading}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft className="size-4" />
                        </Button>
                        <div className="flex items-center gap-1 px-2 text-sm font-medium">
                            <span>{cursorHistory.length}</span>
                            <span className="text-muted-foreground">of</span>
                            <span>{paginatedUserAccount.pageInfo.totalPages}</span>
                        </div>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={goToNextPage}
                            disabled={!paginatedUserAccount.pageInfo.hasNextPage || loading}
                        >
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight className="size-4" />
                        </Button>
                    </div>

                    {/* Right: Rows per page */}
                    <div className="flex items-center gap-2">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
                        </Label>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => {
                                setPageSize(Number(value))
                            }}
                            disabled={loading}
                        >
                            <SelectTrigger className="h-8 w-auto" id="rows-per-page">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </TabsContent>
    );
}
