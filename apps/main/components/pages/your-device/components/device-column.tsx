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
    AlertDialogTrigger,
} from '@repo/shadcn-ui/components/alert-dialog';
import { IconDeviceDesktop, IconDeviceMobile, IconDots, IconLogout } from '@tabler/icons-react';
import { formatDateTime } from '@repo/commons/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
    CredentialDevice,
    CredentialDeviceStatus,
} from '@repo/commons/types/auth-service-schema.type';

const DeviceIcon = ({ type }: { type: string }) => {
    if (type === 'Mobile Device') {
        return <IconDeviceMobile className="text-muted-foreground size-5" />;
    }

    return <IconDeviceDesktop className="text-muted-foreground size-5" />;
};

function DeviceActionsCell({
    device,
    onRevokeAccess,
}: {
    device: CredentialDevice;
    onRevokeAccess: (id: string) => void;
}) {
    const [open, setOpen] = useState(false);

    if (device.status === CredentialDeviceStatus.CURRENT) {
        return null;
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                        <IconDots className="size-4" />
                        <span className="sr-only">Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem>
                            <IconLogout className="size-4" />
                            Revoke access
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Revoke device access</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to revoke access for this device? This will
                        immediately end its session.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onRevokeAccess(device.publicId);
                            setOpen(false);
                        }}
                    >
                        Revoke access
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function createDeviceColumns(
    signOutDevice: (id: string) => void,
): ColumnDef<CredentialDevice>[] {
    return [
        {
            accessorKey: 'deviceName',
            header: 'Device',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <DeviceIcon type={row.original.deviceType} />
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.deviceLabel}</span>
                        <span className="text-muted-foreground text-xs">{row.original.os}</span>
                    </div>
                </div>
            ),
            size: 180,
            enableHiding: false,
        },
        {
            accessorKey: 'browser',
            header: 'Browser',
            cell: ({ row }) => <span className="text-sm">{row.original.browser}</span>,
            size: 120,
        },
        {
            accessorKey: 'ipAddress',
            header: 'IP Address',
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.ipAddress}</span>,
            size: 130,
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => {
                if (!row.original.city || !row.original.country) {
                    return <span className="text-muted-foreground text-xs">-</span>;
                }

                return (
                    <span className="text-sm">
                        {row.original.city} {row.original.country}
                    </span>
                );
            },
            size: 160,
        },
        {
            accessorKey: 'lastActive',
            header: 'Last Active',
            cell: ({ row }) => (
                <div className="text-sm">
                    <div className="font-medium">
                        {row.original.status === CredentialDeviceStatus.CURRENT ? (
                            'Now'
                        ) : (
                            <>
                                <div className="font-medium">
                                    {formatDateTime(row.original.lastSeenAt, {
                                        format: 'dd MMM yyyy',
                                    })}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {formatDateTime(row.original.lastSeenAt, { format: 'hh:mm a' })}
                                </div>
                            </>
                        )}
                    </div>
                    {row.original.status === CredentialDeviceStatus.CURRENT && (
                        <div className="text-muted-foreground text-xs">
                            {formatDateTime(row.original.lastSeenAt, {
                                format: 'hh:mm a',
                            })}
                        </div>
                    )}
                </div>
            ),
            size: 120,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                if (row.original.status === CredentialDeviceStatus.CURRENT) {
                    return (
                        <Badge variant="outline" className="border-green-600 text-green-600">
                            Current
                        </Badge>
                    );
                }

                const lastActive = new Date(row.original.lastSeenAt);
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                if (lastActive >= oneDayAgo) {
                    return (
                        <Badge variant="outline" className="border-blue-600 text-blue-600">
                            Active
                        </Badge>
                    );
                }
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        Inactive
                    </Badge>
                );
            },
            size: 100,
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <DeviceActionsCell device={row.original} onRevokeAccess={signOutDevice} />
            ),
            size: 50,
            enableHiding: false,
        },
    ];
}
