"use client";

import { Badge } from "@/shadcn/components/badge";
import { Button } from "@repo/shadcn-ui/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shadcn/components/dropdown-menu";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@repo/shadcn-ui/components/alert-dialog";
import {
    IconBuilding,
    IconCheck,
    IconDots,
    IconX,
} from "@tabler/icons-react";
import { formatDateTime } from "@repo/commons/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type { InvitationStatus, MockInvitation } from "../invitation-container";

const statusConfig: Record<InvitationStatus, { label: string; className: string }> = {
    PENDING_INVITATION: {
        label: "Pending",
        className: "text-yellow-600 border-yellow-600",
    },
    ACTIVE: {
        label: "Accepted",
        className: "text-green-600 border-green-600",
    },
    EXPIRED_INVITATION: {
        label: "Expired",
        className: "text-red-600 border-red-600",
    },
};

function InvitationActionsCell({
    invitation,
    onAccept,
    onDecline,
}: {
    invitation: MockInvitation;
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
}) {
    const [acceptOpen, setAcceptOpen] = useState(false);
    const [declineOpen, setDeclineOpen] = useState(false);

    if (invitation.status !== "PENDING_INVITATION") {
        return null;
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                        <IconDots className="size-4" />
                        <span className="sr-only">Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setAcceptOpen(true)}>
                        <IconCheck className="size-4" />
                        Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDeclineOpen(true)}>
                        <IconX className="size-4" />
                        Decline
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={acceptOpen} onOpenChange={setAcceptOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Accept invitation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to accept the invitation from{" "}
                            <span className="font-medium">{invitation.companyName}</span> as{" "}
                            <span className="font-medium">{invitation.position}</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            onClick={() => {
                                onAccept(invitation.publicId);
                                setAcceptOpen(false);
                            }}
                        >
                            Accept
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={declineOpen} onOpenChange={setDeclineOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Decline invitation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to decline the invitation from{" "}
                            <span className="font-medium">{invitation.companyName}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onDecline(invitation.publicId);
                                setDeclineOpen(false);
                            }}
                        >
                            Decline
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export function createInvitationColumns(
    acceptInvitation: (id: string) => void,
    declineInvitation: (id: string) => void,
): ColumnDef<MockInvitation>[] {
    return [
        {
            accessorKey: "companyName",
            header: "Company / Branch",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <IconBuilding className="size-5 text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.companyName}</span>
                        <span className="text-xs text-muted-foreground">
                            {row.original.branchName} ({row.original.branchCode})
                        </span>
                    </div>
                </div>
            ),
            size: 200,
            enableHiding: false,
        },
        {
            accessorKey: "position",
            header: "Position",
            cell: ({ row }) => (
                <span className="text-sm">{row.original.position}</span>
            ),
            size: 150,
        },
        {
            accessorKey: "invitedBy",
            header: "Invited By",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{row.original.invitedBy.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.invitedBy.email}</span>
                </div>
            ),
            size: 180,
        },
        {
            accessorKey: "invitedAt",
            header: "Date",
            cell: ({ row }) => (
                <div className="text-sm">
                    <div className="font-medium">
                        {formatDateTime(row.original.invitedAt, { format: "dd MMM yyyy" })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDateTime(row.original.invitedAt, { format: "hh:mm a" })}
                    </div>
                </div>
            ),
            size: 120,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const config = statusConfig[row.original.status];
                return (
                    <Badge variant="outline" className={config.className}>
                        {config.label}
                    </Badge>
                );
            },
            size: 100,
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <InvitationActionsCell
                    invitation={row.original}
                    onAccept={acceptInvitation}
                    onDecline={declineInvitation}
                />
            ),
            size: 50,
            enableHiding: false,
        },
    ];
}
