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
import { useCompanyDetail } from "./company-detail-container";
import { BranchPaginationInput, PaginatedBranch } from "@repo/commons/types/account-service-schema.type";
import { useCallback, useEffect, useState } from "react";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { BranchColumn } from "./components/branch-column";
import { BranchRow } from "./components/branch-row";
import { BranchSkeletonRow } from "./components/branch-skeleton-row";
import { BRANCH_PAGINATION_SIZE } from "@/root/libs/constants";

interface GetUserCompaniesResponse {
    getCompanyBranches: PaginatedBranch;
}

interface GetUserCompaniesVariables {
    pagination: BranchPaginationInput;
    companyPublicId: string
}

const GET_COMPANY_BRANCHES: TypedDocumentNode<GetUserCompaniesResponse, GetUserCompaniesVariables> = gql`
    query GetCompanyBranches($pagination:BranchPaginationInput!,$companyPublicId:String!){
        getCompanyBranches(pagination:$pagination,companyPublicId:$companyPublicId){
            data { 
                publicId
                name
                code
                email
                phoneCode
                phoneNumber
                isActive
                branchPhysicalAddresses {
                    city
                    state
                    country
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
`

const initialPaginatedBranch: PaginatedBranch = {
    data: [],
    pageInfo: {
        endCursor: null,
        hasNextPage: false,
        total: 0,
        currentPage: 1,
        totalPages: 1
    },
}

export default function BranchesTab() {
    const ctx = useCompanyDetail();
    const [getCompanyBranches, { data, loading }] = useLazyQuery(GET_COMPANY_BRANCHES);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageSize, setPageSize] = useState(BRANCH_PAGINATION_SIZE)
    const [paginatedBranch, setPaginatedBranch] = useState<PaginatedBranch>(initialPaginatedBranch)
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedBranch.pageInfo.hasNextPage && paginatedBranch.pageInfo.endCursor !== null) {
            // Save current cursor to history for back navigation
            setCursorHistory(prev => [...prev, paginatedBranch.pageInfo.endCursor]);
            getCompanyBranches({
                variables: {
                    companyPublicId: ctx.company?.publicId ?? "-1",
                    pagination: {
                        cursor: paginatedBranch.pageInfo.endCursor,
                        take: pageSize
                    }
                }
            });
        }
    }, [paginatedBranch, pageSize, getCompanyBranches]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            // Remove the last cursor and use the one before it
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getCompanyBranches({
                variables: {
                    companyPublicId: ctx.company?.publicId ?? "-1",
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize
                    }
                }
            });
        }
    }, [cursorHistory, pageSize, getCompanyBranches]);

    const table = useReactTable({
        data: paginatedBranch.data,
        columns: BranchColumn,
        state: {
            sorting,
        },
        getRowId: (row) => row.publicId.toString(),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: paginatedBranch.pageInfo.totalPages,
    });

    useEffect(() => {
        setPaginatedBranch(data?.getCompanyBranches ?? ctx.company?.branches ?? initialPaginatedBranch)
    }, [ctx.company?.branches, data?.getCompanyBranches])

    return (
        <TabsContent value="branches">
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
                                                        header.column.id === "branchName"
                                                            ? "auto"
                                                            : header.column.id === "contact"
                                                                ? `${header.getSize()}px`
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
                                // Show skeleton rows matching the page size
                                Array.from({ length: pageSize }).map((_, index) => (
                                    <BranchSkeletonRow key={`skeleton-${index}`} />
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <BranchRow
                                        key={row.id}
                                        row={row}
                                        companyId={ctx.company?.publicId || "-1"}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={BranchColumn.length}
                                        className="h-24 text-center"
                                    >
                                        No branches found.
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
                            {paginatedBranch.pageInfo.total === 0
                                ? 0
                                : (paginatedBranch.pageInfo.currentPage - 1) * pageSize + 1}
                        </span>
                        {" - "}
                        <span className="font-medium text-foreground">
                            {Math.min(
                                paginatedBranch.pageInfo.currentPage * pageSize,
                                paginatedBranch.pageInfo.total
                            )}
                        </span>
                        {" of "}
                        <span className="font-medium text-foreground">
                            {paginatedBranch.pageInfo.total}
                        </span>
                    </div>

                    {/* Center: Pagination controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={goToPreviousPage}
                            disabled={paginatedBranch.pageInfo.currentPage === 1 || loading}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft className="size-4" />
                        </Button>
                        <div className="flex items-center gap-1 px-2 text-sm font-medium">
                            <span>{paginatedBranch.pageInfo.currentPage}</span>
                            <span className="text-muted-foreground">of</span>
                            <span>{paginatedBranch.pageInfo.totalPages}</span>
                        </div>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={goToNextPage}
                            disabled={!paginatedBranch.pageInfo.hasNextPage || loading}
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
