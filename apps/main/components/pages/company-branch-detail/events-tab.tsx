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
    IconChevronsLeft,
    IconChevronsRight,
} from "@tabler/icons-react";
import { TabsContent } from "@/shadcn/components/tabs";
import { useCompanyBranchDetail } from "./company-branch-detail-container";
import { useCallback, useEffect, useState } from "react";
import { EventColumn } from "./components/event-column";
import EventRow from "./components/event-row";
import { EventSkeletonRow } from "./components/event-skeleton-row";
import { BranchEventPaginationInput, PaginatedBranchEvent } from "@repo/commons/types/account-service-schema.type";
import { BRANCH_EVENT_PAGINATION_SIZE } from "@/root/libs/constants";
import { useLazyQuery } from "@apollo/client/react";
import { gql, TypedDocumentNode } from "@apollo/client";

interface GetBranchEventResponse {
    getCompanyBranchEvent: PaginatedBranchEvent;
}

interface GetBranchEventVariables {
    pagination: BranchEventPaginationInput;
    companyPublicId: string;
}

const GET_COMPANY_BRANCH_EVENT: TypedDocumentNode<GetBranchEventResponse, GetBranchEventVariables> = gql`
    query GetCompanyBranchEvent($pagination: BranchEventPaginationInput!, $companyPublicId: String!) {
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
`

const initialPaginatedBranchEvent: PaginatedBranchEvent = {
    data: [],
    pageInfo: {
        endCursor: null,
        hasNextPage: false,
        total: 0,
        currentPage: 1,
        totalPages: 1
    },
}

export default function EventsTab() {
    const ctx = useCompanyBranchDetail();
    const [getCompanyBranchEvent, { data, loading }] = useLazyQuery(GET_COMPANY_BRANCH_EVENT);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageSize, setPageSize] = useState(BRANCH_EVENT_PAGINATION_SIZE);
    const [paginatedUserAccount, setPaginatedUserAccount] = useState<PaginatedBranchEvent>(initialPaginatedBranchEvent);
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedUserAccount.pageInfo.hasNextPage && paginatedUserAccount.pageInfo.endCursor !== null) {
            setCursorHistory(prev => [...prev, paginatedUserAccount.pageInfo.endCursor]);
            getCompanyBranchEvent({
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
    }, [paginatedUserAccount, pageSize, getCompanyBranchEvent, ctx.branch]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getCompanyBranchEvent({
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
    }, [cursorHistory, pageSize, getCompanyBranchEvent, ctx.branch]);

    const table = useReactTable({
        data: paginatedUserAccount.data,
        columns: EventColumn,
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
        setPaginatedUserAccount(data?.getCompanyBranchEvent ?? ctx.branch?.branchEvents ?? initialPaginatedBranchEvent)
    }, [ctx.branch?.userAccounts, data?.getCompanyBranchEvent])

    return (
        <TabsContent value="events">
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
                                                        header.column.id === "title"
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
                                    <EventSkeletonRow key={`skeleton-${index}`} />
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <EventRow
                                        key={row.id}
                                        row={row}
                                        companyId={ctx.branch?.company.publicId ?? "-1"}
                                        branchId={ctx.branch?.publicId ?? "-1"}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={EventColumn.length}
                                        className="h-24 text-center"
                                    >
                                        No events found.
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
