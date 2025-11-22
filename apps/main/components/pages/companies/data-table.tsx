"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/shadcn-ui/components/avatar"
import { Button } from "@repo/shadcn-ui/components/button"
import { Label } from "@repo/shadcn-ui/components/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/shadcn-ui/components/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/shadcn-ui/components/table"
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from "@tabler/icons-react"
import { companyData, companySchema } from "@/root/libs/mock-up/company-data"

// TableCellViewer component for displaying company with logo
function TableCellViewer({ item }: { item: z.infer<typeof companySchema> }) {
    const initials = item.companyName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    const isActive = item.status === "active"

    return (
        <div className="flex items-center gap-3">
            <Avatar className="size-10 rounded-lg">
                <AvatarImage src={item.logo} alt={item.companyName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium">{item.companyName}</span>
            </div>
            <div className="flex justify-center items-center">
                <div
                    className={`mr-1.5 size-2 rounded-full ${isActive ? "bg-green-600 dark:bg-green-400" : "bg-muted-foreground"}`}
                />
            </div>
        </div>
    )
}

const columns: ColumnDef<z.infer<typeof companySchema>>[] = [
    {
        accessorKey: "companyName",
        header: "Company",
        cell: ({ row }) => {
            return <TableCellViewer item={row.original} />
        },
        enableHiding: false,
    },
    {
        accessorKey: "registrationNumber",
        header: "Registration Number",
        cell: ({ row }) => (
            <div className="font-mono text-sm text-muted-foreground">
                {row.original.registrationNumber}
            </div>
        ),
        size: 170,
    },
    {
        accessorKey: "registeredAt",
        header: "Registered Date",
        cell: ({ row }) => {
            const date = new Date(row.original.registeredAt)
            return (
                <div className="text-muted-foreground">
                    {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            )
        },
        size: 140,
    },
    {
        accessorKey: "employees",
        header: () => <div className="text-right">Employees</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium tabular-nums">
                {row.original.employees.toLocaleString()}
            </div>
        ),
        size: 110,
    },
    {
        accessorKey: "branches",
        header: () => <div className="text-right">Branches</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium tabular-nums">
                {row.original.branches.toLocaleString()}
            </div>
        ),
        size: 100,
    },
    {
        accessorKey: "tokenUsage",
        header: () => <div className="text-right">Token Usage</div>,
        cell: ({ row }) => (
            <div className="text-right tabular-nums">
                <div className="font-medium">{row.original.tokenUsage.toLocaleString()}</div>
            </div>
        ),
        size: 130,
    }
]

function CompanyRow({ row }: { row: Row<z.infer<typeof companySchema>> }) {
    const router = useRouter()

    const handleRowClick = (e: React.MouseEvent) => {
        // Prevent navigation when clicking on interactive elements
        const target = e.target as HTMLElement
        if (
            target.closest("button") ||
            target.closest("input") ||
            target.closest("a")
        ) {
            return
        }

        router.push(`/my-account/company/${row.original.id}`)
    }

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
                                cell.column.id === "companyName"
                                    ? "auto"
                                    : `${cell.column.getSize()}px`,
                        }}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                )
            })}
        </TableRow>
    )
}

export function DataTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data: companyData,
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
    })

    return (
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
                                                    header.column.id === "companyName"
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
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <CompanyRow key={row.id} row={row} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No companies found.
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
                            table.setPageSize(Number(value))
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
        </div>
    )
}
