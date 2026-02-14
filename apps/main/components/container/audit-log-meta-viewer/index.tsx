'use client';

import { activityTypeConfig } from '@/root/libs/constants';
import { Badge } from '@/shadcn/components/badge';
import { Button } from '@/shadcn/components/button';
import { Separator } from '@/shadcn/components/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shadcn/components/sheet';
import { AuditLog } from '@repo/commons/types/audit-service-schema.type';
import { Branch, Company } from '@repo/commons/types/account-service-schema.type';
import { formatDateTime } from '@repo/commons/utils/date';
import { Building2, Calendar, Eye, GitBranch, Info, Server } from 'lucide-react';

import { DiffEntry } from './diff-entry';
import { InfoRow } from './info-row';
import { buildDiffEntries } from './utils';

export default function AuditLogMetaViewer({ audit }: { audit: AuditLog }) {
    const typeKey = audit.type.toLowerCase();
    const typeConfig = activityTypeConfig[typeKey as keyof typeof activityTypeConfig] ?? {
        variant: 'secondary' as const,
        className: '',
        label: audit.type,
    };

    const meta = audit.auditLogMetaData;
    const diffEntries = buildDiffEntries(meta?.before, meta?.after);
    const additional = meta?.additional;
    const hasAdditional =
        additional !== null &&
        additional !== undefined &&
        (typeof additional !== 'object' || Object.keys(additional as object).length > 0);

    const author = audit.auditLogAuthor;
    const company = (author as typeof author & { company?: Company })?.company;
    const branch = (author as typeof author & { branch?: Branch })?.branch;
    const resource = audit.auditLogResource;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="xs"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground h-auto gap-1.5 px-2 py-1.5"
                >
                    <Eye className="size-3.5" />
                    <span className="max-w-[200px] truncate text-xs">
                        {audit.description || 'View details'}
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
                <SheetHeader className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Badge variant={typeConfig.variant} className={typeConfig.className}>
                            {typeConfig.label}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                            {formatDateTime(audit.emittedAt, {
                                format: 'dd MMM yyyy, hh:mm a',
                            })}
                        </span>
                    </div>
                    <SheetTitle className="text-base">
                        {audit.description || 'Audit Log Detail'}
                    </SheetTitle>
                    <SheetDescription>
                        Review changes and additional metadata for this transaction.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {/* Context Info */}
                    {(company || branch || resource) && (
                        <div className="space-y-3 px-4 pb-4">
                            <div className="bg-muted/30 grid gap-3 rounded-lg border p-3">
                                {company && (
                                    <InfoRow icon={Building2} label="Company">
                                        {company.name}
                                    </InfoRow>
                                )}
                                {branch && (
                                    <InfoRow icon={GitBranch} label="Branch">
                                        <span className="flex items-center gap-1.5">
                                            {branch.name}
                                            <span className="text-muted-foreground font-mono text-xs">
                                                {branch.code.slice(0, 8)}
                                            </span>
                                        </span>
                                    </InfoRow>
                                )}
                                {resource && (
                                    <InfoRow icon={Server} label="Resource">
                                        <span className="flex items-center gap-1.5">
                                            {resource.type}
                                            <span className="text-muted-foreground font-mono text-xs">
                                                #{resource.publicId.slice(0, 8)}
                                            </span>
                                        </span>
                                    </InfoRow>
                                )}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Changes / Diff */}
                    <div className="space-y-3 px-4 py-4">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">Changes</h4>
                            {diffEntries.length > 0 && (
                                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                                    {diffEntries.length}
                                </Badge>
                            )}
                        </div>

                        {diffEntries.length > 0 ? (
                            <div className="rounded-lg border">
                                <div className="divide-y">
                                    {diffEntries.map((entry) => (
                                        <DiffEntry
                                            key={entry.key}
                                            entryKey={entry.key}
                                            before={entry.before}
                                            after={entry.after}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                                <Info className="text-muted-foreground/50 mb-2 size-5" />
                                <p className="text-muted-foreground text-sm">
                                    No field changes recorded
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Additional Metadata */}
                    {hasAdditional && (
                        <>
                            <Separator />
                            <div className="space-y-3 px-4 py-4">
                                <h4 className="text-sm font-semibold">Additional Metadata</h4>
                                <pre className="bg-muted/50 text-muted-foreground overflow-x-auto rounded-lg border p-3 font-mono text-xs leading-relaxed">
                                    {JSON.stringify(additional, null, 2)}
                                </pre>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-3">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                        <Calendar className="size-3" />
                        <span>
                            Emitted{' '}
                            {formatDateTime(audit.emittedAt, {
                                format: 'dd MMM yyyy, hh:mm a',
                            })}
                        </span>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
