"use client";

import * as React from "react";
import { z } from "zod";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@repo/shadcn-ui/components/badge";
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
import { activityLogSchema } from "@/root/libs/mock-up/company-data";

const activityTypeConfig = {
    create: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600", label: "Create" },
    update: { variant: "default" as const, className: "bg-blue-500 hover:bg-blue-600", label: "Update" },
    delete: { variant: "destructive" as const, className: "", label: "Delete" },
    login: { variant: "default" as const, className: "bg-purple-500 hover:bg-purple-600", label: "Login" },
    logout: { variant: "secondary" as const, className: "", label: "Logout" },
    settings: { variant: "default" as const, className: "bg-amber-500 hover:bg-amber-600", label: "Settings" },
};

const columns: ColumnDef<z.infer<typeof activityLogSchema>>[] = [
    {
        accessorKey: "timestamp",
        header: "Time",
        cell: ({ row }) => {
            const timestamp = new Date(row.original.timestamp);
            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {timestamp.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}
                    </div>
                </div>
            );
        },
        size: 150,
        enableHiding: false,
    },
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.user.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                        {row.original.user.userCode}
                    </span>
                </div>
            );
        },
        size: 180,
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.original.type;
            const config = activityTypeConfig[type];

            return (
                <Badge
                    variant={config.variant}
                    className={config.className}
                >
                    {config.label}
                </Badge>
            );
        },
        size: 120,
    },
    {
        accessorKey: "resource",
        header: "Resource",
        cell: ({ row }) => {
            return (
                <div className="text-sm">
                    <span className="font-medium">{row.original.resource}</span>
                    {row.original.resourceId && (
                        <span className="ml-1 font-mono text-xs text-muted-foreground">
                            #{row.original.resourceId}
                        </span>
                    )}
                </div>
            );
        },
        size: 150,
    },
    {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => {
            return (
                <div className="max-w-md text-sm text-muted-foreground">
                    {row.original.details}
                </div>
            );
        },
        enableHiding: false,
    },
];

export default function ActivityLogsTab() {
    const ctx = useCompanyBranchDetail();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: [],
        columns,
        state: {
            sorting,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

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
                                                        header.column.id === "details"
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
                            {table.getRowModel().rows?.length ? (
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
                                                            cell.column.id === "details"
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
                                        colSpan={columns.length}
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
                {table.getRowModel().rows?.length > 0 && (
                    <div className="flex items-center justify-between px-4">
                        {/* Left: Showing count */}
                        <div className="text-sm text-muted-foreground">
                            Showing{" "}
                            <span className="font-medium text-foreground">
                                {table.getRowModel().rows.length === 0
                                    ? 0
                                    : table.getState().pagination.pageIndex *
                                    table.getState().pagination.pageSize +
                                    1}
                            </span>
                            {" - "}
                            <span className="font-medium text-foreground">
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) *
                                    table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length
                                )}
                            </span>
                            {" of "}
                            <span className="font-medium text-foreground">
                                {table.getFilteredRowModel().rows.length}
                            </span>
                        </div>

                        {/* Center: Pagination controls */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft className="size-4" />
                            </Button>
                            <div className="flex items-center gap-1 px-2 text-sm font-medium">
                                <span>{table.getState().pagination.pageIndex + 1}</span>
                                <span className="text-muted-foreground">of</span>
                                <span>{table.getPageCount()}</span>
                            </div>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight className="size-4" />
                            </Button>
                        </div>

                        {/* Right: Rows per page */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="h-8 w-16" id="rows-per-page">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
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
                )}
            </div>
        </TabsContent>
    );
}
