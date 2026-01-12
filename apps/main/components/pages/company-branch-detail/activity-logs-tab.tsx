"use client";

import * as React from "react";
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
import { AuditLogPaginationInput, PaginatedAuditLog } from "@repo/commons/types/audit-service-schema.type";
import { AUDIT_LOG_PAGINATION_SIZE } from "@/root/libs/constants";
import { createInitialPaginatedData } from "@repo/commons/utils/pagination-helpers";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { useCallback, useEffect, useState } from "react";
import { ActivityColumn } from "./components/activity-column";
import { ActivitySkeletonRow } from "./components/activity-skeleton-row";

interface GetAuditLogsResponse {
    getAuditLogs: PaginatedAuditLog;
}

interface GetAuditLogsVariables {
    pagination: AuditLogPaginationInput;
    companyPublicId: string;
}

const GET_AUDIT_LOGS: TypedDocumentNode<GetAuditLogsResponse, GetAuditLogsVariables> = gql`
    query GetAuditLogs(
        $companyPublicId:String!
        $pagination: AuditLogPaginationInput!
        ) {
        getAuditLogs(pagination: $pagination) {
            data {
                publicId
                emittedAt
                type
                description
                auditLogAuthor {
                    publicId
                    credentialId
                    user {
                        publicId
                        firstName
                        lastName
                        nickname
                        companyEmployee(companyPublicId: $companyPublicId){
                            internalId
                        }
                    }
                }
                auditLogResource {
                    publicId
                    type
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

export default function ActivityLogsTab() {
    const ctx = useCompanyBranchDetail();
    const [getAuditLogs, { data, loading }] = useLazyQuery(GET_AUDIT_LOGS);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pageSize, setPageSize] = useState(AUDIT_LOG_PAGINATION_SIZE);
    const [paginatedAuditLog, setPaginatedAuditLog] = useState<PaginatedAuditLog>(createInitialPaginatedData());
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (paginatedAuditLog.pageInfo.hasNextPage && paginatedAuditLog.pageInfo.endCursor !== null) {
            setCursorHistory(prev => [...prev, paginatedAuditLog.pageInfo.endCursor]);
            getAuditLogs({
                variables: {
                    companyPublicId: ctx.branch?.company?.publicId ?? "-1",
                    pagination: {
                        cursor: paginatedAuditLog.pageInfo.endCursor,
                        take: pageSize,
                        branchId: ctx.branch?.publicId,
                    }
                }
            });
        }
    }, [paginatedAuditLog, pageSize, getAuditLogs, ctx.branch]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getAuditLogs({
                variables: {
                    companyPublicId: ctx.branch?.company?.publicId ?? "-1",
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                        branchId: ctx.branch?.publicId,
                    }
                }
            });
        }
    }, [cursorHistory, pageSize, getAuditLogs, ctx.branch]);

    const table = useReactTable({
        data: paginatedAuditLog.data,
        columns: ActivityColumn,
        state: {
            sorting,
        },
        getRowId: (row) => row.publicId.toString(),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: paginatedAuditLog.pageInfo.totalPages,
    });

    useEffect(() => {
        setPaginatedAuditLog(data?.getAuditLogs ?? ctx.branch?.auditLogs ?? createInitialPaginatedData())
    }, [ctx.branch?.auditLogs, data?.getAuditLogs])

    return (
        <TabsContent value="activity-logs">
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
                                                        header.column.id === "description"
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
                                    <ActivitySkeletonRow key={`skeleton-${index}`} />
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="transition-colors hover:bg-muted/50"
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className="px-5 py-3"
                                                    style={{
                                                        width:
                                                            cell.column.id === "description"
                                                                ? "auto"
                                                                : `${cell.column.getSize()}px`,
                                                    }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={ActivityColumn.length}
                                        className="h-24 text-center"
                                    >
                                        No activity logs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center justify-between px-4">
                    {/* Left: Showing count */}
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium text-foreground">
                            {paginatedAuditLog.pageInfo.total === 0
                                ? 0
                                : (cursorHistory.length - 1) * pageSize + 1}
                        </span>
                        {" - "}
                        <span className="font-medium text-foreground">
                            {Math.min(
                                cursorHistory.length * pageSize,
                                paginatedAuditLog.pageInfo.total
                            )}
                        </span>
                        {" of "}
                        <span className="font-medium text-foreground">
                            {paginatedAuditLog.pageInfo.total}
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
                            <span>{paginatedAuditLog.pageInfo.totalPages}</span>
                        </div>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={goToNextPage}
                            disabled={!paginatedAuditLog.pageInfo.hasNextPage || loading}
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
                                {[10, 20, 30, 40, 50].map((pageSizeOption) => (
                                    <SelectItem key={pageSizeOption} value={`${pageSizeOption}`}>
                                        {pageSizeOption}
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
