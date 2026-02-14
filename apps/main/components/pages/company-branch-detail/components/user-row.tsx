import { TableCell, TableRow } from '@/shadcn/components/table';
import { UserAccount } from '@repo/commons/types/account-service-schema.type';
import { flexRender, Row } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

export default function UserRow({
    row,
    companyId,
    branchId,
}: {
    row: Row<UserAccount>;
    companyId: string;
    branchId: string;
}) {
    const router = useRouter();

    const handleRowClick = (e: React.MouseEvent) => {
        // Prevent navigation when clicking on interactive elements
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('a')) {
            return;
        }

        router.push(
            `/my-account/company/${companyId}/branch/${branchId}/user/${row.original.publicId}`,
        );
    };

    return (
        <TableRow
            onClick={handleRowClick}
            className="hover:bg-muted/50 cursor-pointer transition-colors"
        >
            {row.getVisibleCells().map((cell) => {
                return (
                    <TableCell
                        key={cell.id}
                        className="px-5 py-3"
                        style={{
                            width:
                                cell.column.id === 'fullName'
                                    ? 'auto'
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
