'use client';

import { Badge } from '@/shadcn/components/badge';
import { Button } from '@repo/shadcn-ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shadcn/components/dropdown-menu';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@repo/shadcn-ui/components/alert-dialog';
import { IconCheck, IconDots, IconX } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/shadcn-ui/components/avatar';
import { formatDateTime } from '@repo/commons/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { UserAccount, UserAccountStatus } from '@repo/commons/types/account-service-schema.type';
import { Credential } from '@repo/commons/types/auth-service-schema.type';

const statusConfig: Record<UserAccountStatus, { label: string; className: string }> = {
    [UserAccountStatus.PENDING_INVITATION]: {
        label: 'Pending',
        className: 'text-yellow-600 border-yellow-600',
    },
    [UserAccountStatus.ACTIVE]: {
        label: 'Accepted',
        className: 'text-green-600 border-green-600',
    },
    [UserAccountStatus.EXPIRED_INVITATION]: {
        label: 'Expired',
        className: 'text-red-600 border-red-600',
    },
    [UserAccountStatus.REJECT_INVITATION]: {
        label: 'Rejected',
        className: 'text-orange-600 border-orange-600',
    },
    [UserAccountStatus.INACTIVE]: {
        label: 'Deactivated',
        className: 'text-red-600 border-red-600',
    },
};

function InvitationActionsCell({
    invitation,
    onAccept,
    onDecline,
}: {
    invitation: UserAccount;
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
}) {
    const [acceptOpen, setAcceptOpen] = useState(false);
    const [declineOpen, setDeclineOpen] = useState(false);

    if (invitation.status !== UserAccountStatus.PENDING_INVITATION) {
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
                            Are you sure you want to accept the invitation from{' '}
                            <span className="font-medium">
                                {invitation.companyEmployee.company.name}
                            </span>{' '}
                            as <span className="font-medium">{invitation.position}</span>?
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
                            Are you sure you want to decline the invitation from{' '}
                            <span className="font-medium">
                                {invitation.companyEmployee.company.name}
                            </span>
                            ? This action cannot be undone.
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
): ColumnDef<UserAccount>[] {
    return [
        {
            accessorKey: 'companyName',
            header: 'Company / Branch',
            cell: ({ row }) => {
                const company = row.original.companyEmployee.company;
                const initials = company.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="size-8 rounded-lg">
                            <AvatarImage src={company.logo || ''} alt={company.name} />
                            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{company.name}</span>
                            <span className="text-muted-foreground text-xs">
                                {row.original.branch.name} ({row.original.branch.code.slice(0, 8)})
                            </span>
                        </div>
                    </div>
                );
            },
            size: 200,
            enableHiding: false,
        },
        {
            accessorKey: 'position',
            header: 'Position',
            cell: ({ row }) => <span className="text-sm">{row.original.position}</span>,
            size: 150,
        },
        {
            accessorKey: 'invitedBy',
            header: 'Invited By',
            cell: ({ row }) => {
                const user = row.original.createdBy;
                const credential = user.credential as Credential;
                const isSelf = row.original.companyEmployee.user.publicId === user.publicId;

                if (isSelf) {
                    return <span className="text-muted-foreground text-sm">-</span>;
                }

                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.firstName}</span>
                        <span className="text-muted-foreground text-xs">{credential.email}</span>
                    </div>
                );
            },
            size: 180,
        },
        {
            accessorKey: 'invitedAt',
            header: 'Date',
            cell: ({ row }) => (
                <div className="text-sm">
                    <div className="font-medium">
                        {formatDateTime(row.original.createdAt, { format: 'dd MMM yyyy' })}
                    </div>
                    <div className="text-muted-foreground text-xs">
                        {formatDateTime(row.original.createdAt, { format: 'hh:mm a' })}
                    </div>
                </div>
            ),
            size: 120,
        },
        {
            accessorKey: 'expiredAt',
            header: 'Expired At',
            cell: ({ row }) => {
                const expiredAt = row.original.expiredAt;
                if (!expiredAt) {
                    return <span className="text-muted-foreground text-sm">-</span>;
                }
                return (
                    <div className="text-sm">
                        <div className="font-medium">
                            {formatDateTime(expiredAt, { format: 'dd MMM yyyy' })}
                        </div>
                        <div className="text-muted-foreground text-xs">
                            {formatDateTime(expiredAt, { format: 'hh:mm a' })}
                        </div>
                    </div>
                );
            },
            size: 120,
        },
        {
            accessorKey: 'status',
            header: 'Status',
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
            id: 'actions',
            header: '',
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
