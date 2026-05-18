import { TableCell, TableRow } from '@/shadcn/components/table';
import { UserAccount } from '@repo/commons/types/account-service-schema.type';
import { flexRender, Row } from '@tanstack/react-table';

export default function UserRow({
    row,
    companyId,
    branchId,
}: {
    row: Row<UserAccount>;
    companyId: string;
    branchId: string;
}) {
    return (
        <TableRow className="hover:bg-muted/50 transition-colors">
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
