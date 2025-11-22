"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
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
import { useCompanyDetail } from "./company-detail-container";
import { branchSchema } from "@/root/libs/mock-up/company-data";

const columns: ColumnDef<z.infer<typeof branchSchema>>[] = [
    {
        accessorKey: "branchName",
        header: "Branch",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.branchName}</span>
                    <span className="text-sm text-muted-foreground">
                        {row.original.branchCode}
                    </span>
                </div>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-1">
                    <div className="font-mono text-sm">{row.original.phone}</div>
                    <div className="text-sm text-muted-foreground">
                        {row.original.email}
                    </div>
                </div>
            );
        },
        size: 200,
    },
    {
        accessorKey: "physicalAddress",
        header: "Location",
        cell: ({ row }) => {
            const { city, country } = row.original.physicalAddress;
            return (
                <div className="text-sm">
                    <div>{city}</div>
                    <div className="text-muted-foreground">{country}</div>
                </div>
            );
        },
        size: 180,
    },
    {
        accessorKey: "operationHours",
        header: "Operating Hours",
        cell: ({ row }) => {
            const { days, hours } = row.original.operationHours;
            return (
                <div className="text-sm">
                    <div className="font-medium">{days}</div>
                    <div className="text-muted-foreground">{hours}</div>
                </div>
            );
        },
        size: 180,
    },
    {
        accessorKey: "employees",
        header: () => <div className="text-right">Employees</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium tabular-nums">
                {row.original.employees.toLocaleString()}
            </div>
        ),
        size: 130,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.original.status === "active";
            return (
                <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={isActive ? "bg-green-500 hover:bg-green-600" : ""}
                >
                    {row.original.status}
                </Badge>
            );
        },
        size: 100,
    },
];

function BranchRow({ row, companyId }: { row: Row<z.infer<typeof branchSchema>>; companyId: number }) {
    const router = useRouter();

    const handleRowClick = (e: React.MouseEvent) => {
        // Prevent navigation when clicking on interactive elements
        const target = e.target as HTMLElement;
        if (
            target.closest("button") ||
            target.closest("input") ||
            target.closest("a")
        ) {
            return;
        }

        router.push(`/my-account/company/${companyId}/branch/${row.original.id}`);
    };

    return (
        <TableRow
            onClick={handleRowClick}
            className="cursor-pointer transition-colors hover:bg-muted/50"
        >
            {row.getVisibleCells().map((cell) => {
                return (
                    <TableCell
                        key={cell.id}
                        className="px-5 py-3"
                        style={{
                            width:
                                cell.column.id === "branchName"
                                    ? "auto"
                                    : cell.column.id === "contact"
                                        ? `${cell.column.getSize()}px`
                                        : `${cell.column.getSize()}px`,
                        }}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                );
            })}
        </TableRow>
    );
}

export default function BranchesTab() {
    const ctx = useCompanyDetail();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: ctx.branches,
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

    if (ctx.isLoading.branches) {
        return (
            <div className="bg-red-500/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
        );
    }

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
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <BranchRow
                                        key={row.id}
                                        row={row}
                                        companyId={ctx.company?.id || 0}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No branches found.
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
