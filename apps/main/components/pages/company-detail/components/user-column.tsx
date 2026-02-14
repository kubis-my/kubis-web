'use client';

import { CompanyEmployee } from '@repo/commons/types/account-service-schema.type';
import { Credential } from '@repo/commons/types/auth-service-schema.type';
import { ColumnDef } from '@tanstack/react-table';

export const UserColumn: ColumnDef<CompanyEmployee>[] = [
    {
        accessorKey: 'code',
        header: 'ID',
        cell: ({ row }) => {
            return (
                <div className="font-mono text-sm font-medium">
                    #{row.original.internalId.toString().padStart(5, '0')}
                </div>
            );
        },
        size: 100,
        enableHiding: false,
    },
    {
        accessorKey: 'fullName',
        header: 'Full Name',
        cell: ({ row }) => {
            const fullName = `${row.original.user.firstName} ${row.original.user.lastName}`;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{fullName}</span>
                </div>
            );
        },
        size: 200,
        enableHiding: false,
    },
    {
        accessorKey: 'nickname',
        header: 'Nick Name',
        cell: ({ row }) => {
            return <div className="text-sm">{row.original.user.nickname ?? '-'}</div>;
        },
        size: 150,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => {
            const credential = row.original.user.credential as Credential;

            return <div className="text-sm">{credential?.email ?? '-'}</div>;
        },
        size: 200,
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => {
            return (
                <div className="font-mono text-sm">
                    {row.original.phoneCode && row.original.phoneNumber
                        ? `${row.original.phoneCode} ${row.original.phoneNumber}`
                        : '-'}
                </div>
            );
        },
        size: 140,
    },
];
