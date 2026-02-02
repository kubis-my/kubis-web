"use client";

import { Badge } from "@/shadcn/components/badge";
import { Branch, DayOfWeek } from "@repo/commons/types/account-service-schema.type";
import { ColumnDef } from "@tanstack/react-table";
import { DateTime } from "luxon";

export const BranchColumn: ColumnDef<Branch>[] = [
    {
        accessorKey: "branchName",
        header: "Branch",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-sm text-muted-foreground">
                        #{row.original.code.slice(0, 8)}
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
            const phone = row.original.branchPhysicalAddresses;
            const email = row.original.email;
            const hasPhone = phone?.phoneCode && phone?.phoneNumber;

            if (!hasPhone && !email) {
                return <span className="text-sm text-muted-foreground">—</span>;
            }

            return (
                <div className="flex flex-col gap-1">
                    <div className="font-mono text-sm">
                        {hasPhone ? `${phone.phoneCode} ${phone.phoneNumber}` : <span className="text-muted-foreground">—</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {email || "—"}
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
            const location = row.original.branchPhysicalAddresses;

            if (!location) {
                return <span className="text-sm text-muted-foreground">—</span>;
            }

            return (
                <div className="text-sm">
                    <div>{location.city}</div>
                    <div className="text-muted-foreground">{location.country}</div>
                </div>
            );
        },
        size: 180,
    },
    {
        accessorKey: "operationHours",
        header: "Operating Hours",
        cell: ({ row }) => {
            const operationHours = row.original.branchOperationHours;

            if (!operationHours || operationHours.length === 0) {
                return <span className="text-sm text-muted-foreground">—</span>;
            }

            const openDays = operationHours.filter(r => !r.isClosed);

            if (openDays.length === 0) {
                return <div className="text-sm text-muted-foreground">Closed</div>;
            }

            // Get the order of days
            const dayOrder = Object.values(DayOfWeek);

            // Sort open days by day of week
            const sortedOpenDays = openDays.sort((a, b) =>
                dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
            );

            const firstDay = sortedOpenDays[0]!;
            const lastDay = sortedOpenDays[sortedOpenDays.length - 1]!;

            // Format day range
            const dayRange = sortedOpenDays.length === 1
                ? firstDay.dayOfWeek
                : `${firstDay.dayOfWeek.toLowerCase()} - ${lastDay.dayOfWeek.toLowerCase()}`;

            // Format time - use the first day's hours as representative
            const openTime = DateTime.fromISO(firstDay.openTime).toFormat("h:mm a");
            const closeTime = DateTime.fromISO(firstDay.closeTime).toFormat("h:mm a");
            const timeRange = `${openTime} - ${closeTime}`;

            return (
                <div className="text-sm">
                    <div className="font-medium capitalize">{dayRange}</div>
                    <div className="text-muted-foreground">{timeRange}</div>
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
                {row.original.totalOfEmployee}
            </div>
        ),
        size: 130,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <Badge
                    variant={row.original.isActive ? "default" : "secondary"}
                    className={row.original.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                >
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
        size: 100,
    },
];