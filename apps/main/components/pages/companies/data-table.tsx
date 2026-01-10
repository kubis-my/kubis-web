"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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
import { Skeleton } from "@repo/shadcn-ui/components/skeleton"
import {
    IconChevronLeft,
    IconChevronRight,
} from "@tabler/icons-react"
import { Company } from "@repo/commons/types/account-service-schema.type"
import { useCompany } from "./company-container"

// TableCellViewer component for displaying company with logo
function TableCellViewer({ item }: { item: Company }) {
    const initials = item.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="flex items-center gap-3">
            <Avatar className="size-10 rounded-lg">
                <AvatarImage src={item.logo || ""} alt={item.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex justify-center items-center">
                <div
                    className={`mr-1.5 size-2 rounded-full ${item.isActive ? "bg-green-600 dark:bg-green-400" : "bg-muted-foreground"}`}
                />
            </div>
        </div>
    )
}

const columns: ColumnDef<Company>[] = [
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
                {row.original.registrationNo}
            </div>
        ),
        size: 170,
    },
    {
        accessorKey: "registeredAt",
        header: "Registered Date",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
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
                {row.original.totalActiveEmployee}
            </div>
        ),
        size: 110,
    },
    {
        accessorKey: "branches",
        header: () => <div className="text-right">Branches</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium tabular-nums">
                {row.original.totalActiveBranch}
            </div>
        ),
        size: 100,
    },
    {
        accessorKey: "tokenUsage",
        header: () => <div className="text-right">Token Usage</div>,
        cell: () => (
            <div className="text-right tabular-nums">
                {/* TODO:FIX THIS */}
                <div className="font-medium">0.00</div>
            </div>
        ),
        size: 130,
    }
]

function CompanyRow({ row }: { row: Row<Company> }) {
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

        router.push(`/my-account/company/${row.original.publicId}`)
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

function SkeletonRow() {
    return (
        <TableRow>
            {/* Company name column with avatar */}
            <TableCell className="px-5 py-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="size-2 rounded-full ml-2" />
                </div>
            </TableCell>
            {/* Registration Number */}
            <TableCell className="px-5 py-3" style={{ width: "170px" }}>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            {/* Registered Date */}
            <TableCell className="px-5 py-3" style={{ width: "140px" }}>
                <Skeleton className="h-4 w-28" />
            </TableCell>
            {/* Employees */}
            <TableCell className="px-5 py-3" style={{ width: "110px" }}>
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-12" />
                </div>
            </TableCell>
            {/* Branches */}
            <TableCell className="px-5 py-3" style={{ width: "100px" }}>
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-10" />
                </div>
            </TableCell>
            {/* Token Usage */}
            <TableCell className="px-5 py-3" style={{ width: "130px" }}>
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-16" />
                </div>
            </TableCell>
        </TableRow>
    )
}

export function DataTable() {
    const ctx = useCompany()
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data: ctx.paginatedCompany.data,
        columns,
        state: {
            sorting,
        },
        getRowId: (row) => row.publicId.toString(),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: ctx.paginatedCompany.pageInfo.totalPages,
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
                        {ctx.isFetchingCompany ? (
                            // Show skeleton rows matching the page size
                            Array.from({ length: ctx.pageSize }).map((_, index) => (
                                <SkeletonRow key={`skeleton-${index}`} />
                            ))
                        ) : table.getRowModel().rows?.length ? (
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
                        {ctx.paginatedCompany.pageInfo.total === 0
                            ? 0
                            : (ctx.cursorHistory.length - 1) * ctx.pageSize + 1}
                    </span>
                    {" - "}
                    <span className="font-medium text-foreground">
                        {Math.min(
                            ctx.cursorHistory.length * ctx.pageSize,
                            ctx.paginatedCompany.pageInfo.total
                        )}
                    </span>
                    {" of "}
                    <span className="font-medium text-foreground">
                        {ctx.paginatedCompany.pageInfo.total}
                    </span>
                </div>

                {/* Center: Pagination controls */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={ctx.goToPreviousPage}
                        disabled={ctx.cursorHistory.length === 1 || ctx.isFetchingCompany}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <IconChevronLeft className="size-4" />
                    </Button>
                    <div className="flex items-center gap-1 px-2 text-sm font-medium">
                        <span>{ctx.cursorHistory.length}</span>
                        <span className="text-muted-foreground">of</span>
                        <span>{ctx.paginatedCompany.pageInfo.totalPages}</span>
                    </div>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={ctx.goToNextPage}
                        disabled={!ctx.paginatedCompany.pageInfo.hasNextPage || ctx.isFetchingCompany}
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
                        value={`${ctx.pageSize}`}
                        onValueChange={(value) => {
                            ctx.setPageSize(Number(value))
                        }}
                        disabled={ctx.isFetchingCompany}
                    >
                        <SelectTrigger className="h-8 w-auto" id="rows-per-page">
                            <SelectValue placeholder={ctx.pageSize} />
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
