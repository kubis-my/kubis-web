"use client";

import { TableCell, TableRow } from "@/shadcn/components/table";
import { Branch } from "@repo/commons/types/account-service-schema.type";
import { flexRender, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export function BranchRow({ row, companyId }: { row: Row<Branch>; companyId: string }) {
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

        router.push(`/my-account/company/${companyId}/branch/${row.original.publicId}`);
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