"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/shadcn-ui/components/avatar"
import { DataTable } from "@repo/shadcn-ui/components/data-table"
import { TableCell, TableRow } from "@repo/shadcn-ui/components/table"
import { Skeleton } from "@repo/shadcn-ui/components/skeleton"
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

export function CompanyDataTable() {
    const ctx = useCompany()
    const router = useRouter()

    const handleRowClick = (company: Company) => {
        router.push(`/my-account/company/${company.publicId}`)
    }

    return (
        <DataTable
            columns={columns}
            data={ctx.paginatedCompany.data}
            pageInfo={ctx.paginatedCompany.pageInfo}
            isLoading={ctx.isFetchingCompany}
            pageSize={ctx.pageSize}
            onPageSizeChange={ctx.setPageSize}
            cursorHistory={ctx.cursorHistory}
            onNextPage={ctx.goToNextPage}
            onPreviousPage={ctx.goToPreviousPage}
            emptyMessage="No companies found."
            getRowId={(row) => row.publicId.toString()}
            onRowClick={handleRowClick}
            renderSkeletonRow={() => <SkeletonRow />}
            flexColumnId="companyName"
        />
    )
}
