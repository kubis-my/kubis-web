"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { UserAccount, UserAccountStatus } from "@repo/commons/types/account-service-schema.type";

const columns: ColumnDef<UserAccount>[] = [
    {
        accessorKey: "userCode",
        header: "User Code",
        cell: ({ row }) => {
            return (
                <div className="font-mono text-sm font-medium">
                    #{row.original.code}
                </div>
            );
        },
        size: 100,
        enableHiding: false,
    },
    {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => {
            const fullName = `${row.original.user.firstName} ${row.original.user.lastName}`;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{fullName}</span>
                    {row.original.user.nickname && (
                        <span className="text-sm text-muted-foreground">
                            &quot;{row.original.user.nickname}&quot;
                        </span>
                    )}
                </div>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => {
            return (
                <div className="text-sm">
                    {row.original.position || "-"}
                </div>
            );
        },
        size: 220,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => {
            return (
                <div className="font-mono text-sm">
                    {row.original.phoneCode && row.original.phoneNumber ? `${row.original.phoneCode} ${row.original.phoneNumber}` : "-"}
                </div>
            );
        },
        size: 180,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusConfig = {
                [UserAccountStatus.ACTIVE]: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600", label: "Active" },
                [UserAccountStatus.INACTIVE]: { variant: "secondary" as const, className: "", label: "Inactive" },
                [UserAccountStatus.PENDING_INVITATION]: { variant: "default" as const, className: "bg-amber-500 hover:bg-amber-600", label: "Pending Invitation" },
                [UserAccountStatus.EXPIRED_INVITATION]: { variant: "destructive" as const, className: "", label: "Expired Invitation" },
            };

            const config = statusConfig[status];

            return (
                <Badge
                    variant={config.variant}
                    className={config.className}
                >
                    {config.label}
                </Badge>
            );
        },
        size: 180,
    },
];

function UserRow({ row, companyId }: { row: Row<UserAccount>; companyId: string }) {
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

        router.push(`/my-account/company/${companyId}/user/${row.original.publicId}`);
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
                                cell.column.id === "fullName"
                                    ? "auto"
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

export default function UsersTab() {
    const ctx = useCompanyDetail();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: ctx.company?.userAccounts?.data || [],
        columns,
        state: {
            sorting,
            pagination,
        },
        getRowId: (row) => row.publicId,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

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
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <UserRow
                                        key={row.id}
                                        row={row}
                                        companyId={ctx.company?.publicId || "-1"}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No users found.
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
