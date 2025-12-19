import { Badge } from "@/shadcn/components/badge";
import { BranchEvent } from "@repo/commons/types/account-service-schema.type";
import { formatDateTime, getDuration } from "@repo/commons/utils/date";
import { ColumnDef } from "@tanstack/react-table";

export const EventColumn: ColumnDef<BranchEvent>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const startDate = new Date(row.original.startDate);
            const endDate = new Date(row.original.endDate);
            const isSameDay = startDate.toDateString() === endDate.toDateString();

            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {formatDateTime(row.original.startDate, { format: "dd MMM yyyy" })}
                    </div>
                    {!isSameDay && (
                        <div className="text-xs text-muted-foreground">
                            to {formatDateTime(row.original.endDate, { format: "dd MMM yyyy" })}
                        </div>
                    )}
                </div>
            );
        },
        size: 150,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Event Name",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-sm text-muted-foreground truncate">
                        {row.original.description}
                    </span>
                </div>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            return (
                <Badge variant="outline">{row.original.type}</Badge>
            );
        },
        size: 150,
    },
    {
        accessorKey: "allDay",
        header: "Duration",
        cell: ({ row }) => {
            return (
                <div className="text-sm">
                    {getDuration(new Date(row.original.startDate), new Date(row.original.endDate))}
                </div>
            );
        },
        size: 120,
    },
];