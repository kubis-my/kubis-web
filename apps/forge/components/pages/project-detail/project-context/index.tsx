'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ShieldXIcon, Loader2Icon, PencilIcon, ShieldCheckIcon, ShieldAlertIcon, Trash2Icon, MoreVerticalIcon, EyeIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { useApolloClient, useMutation, useLazyQuery } from '@apollo/client/react';
import { Badge } from '@/shadcn/components/badge';
import { Button } from '@/shadcn/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shadcn/components/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/shadcn/components/dialog';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shadcn/components/table';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { hasSuperAdminAccess } from '@repo/commons/utils/auth';
import {
    ProjectContextValueType,
    type EnvironmentEntry,
} from '@repo/commons/types/forge-service-schema.type';
import { useProjectDetail } from '../project-detail-container';
import { UPSERT_CONTEXT_ENVIRONMENT, REVEAL_CONTEXT_ENVIRONMENT_SECRET } from './graphql';
import { AddContextEntryDialog, EditContextEntryDialog } from './entry-dialogs';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { truncateWord } from '@repo/commons/utils/string';
import { formatDateTime } from '@repo/commons/utils/date';

export default function ProjectContext() {
    const client = useApolloClient();
    const { project } = useProjectDetail();
    const { authUser } = useAuth();
    const { updateHeaderAction } = useDashboard01();
    const isKubisTeam = useMemo(() => hasSuperAdminAccess(authUser?.companies ?? []), [authUser]);

    const entries = project.projectSettings?.environment ?? [];

    const [editEntry, setEditEntry] = useState<EnvironmentEntry | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteEntry, setConfirmDeleteEntry] = useState<EnvironmentEntry | null>(null);
    const [confirmInput, setConfirmInput] = useState('');
    const [revealingId, setRevealingId] = useState<string | null>(null);
    const [revealDialog, setRevealDialog] = useState<{ entry: EnvironmentEntry; value: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const [upsertEntry] = useMutation(UPSERT_CONTEXT_ENVIRONMENT);
    const [revealSecret] = useLazyQuery(REVEAL_CONTEXT_ENVIRONMENT_SECRET, { fetchPolicy: 'no-cache' });

    useEffect(() => {
        updateHeaderAction(
            <div className="flex items-center gap-2">
                <AddContextEntryDialog projectPublicId={project.id} />
            </div>,
        );

        return () => {
            updateHeaderAction(undefined);
        };
    }, []);

    const handleReveal = async (entry: EnvironmentEntry) => {
        setRevealingId(entry.id);

        try {
            if (entry.type === "string") {
                setCopied(false);
                setRevealDialog({ entry, value: entry.value });
                return;
            }

            const { data, error } = await revealSecret({
                variables: { projectPublicId: project.id, entryId: entry.id },
            });

            if (hasGraphQLError(error)) {
                const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

                if (gqlError) {
                    const err = gqlError.extensions?.originalError as
                        | Record<string, any>
                        | undefined;

                    if (err?.id === "ENVIRONMENT_ENTRY_NOT_SECRET") {
                        toast.error("Only secure environment entries can be revealed", { position: 'top-center' });
                        return;
                    }

                    if (err?.id === "ENVIRONMENT_SECRET_REVEAL_NOT_ALLOWED") {
                        toast.error("This secret can only be revealed by super admins", { position: 'top-center' });
                        return;
                    }
                }
            }

            if (data) {
                setCopied(false);
                setRevealDialog({ entry, value: data.revealProjectContextEnvironmentSecretForForge });
            }
        } catch {
            toast.error('Failed to reveal secret.', { position: 'top-center' });
        } finally {
            setRevealingId(null);
        }
    };

    const handleCopy = () => {
        if (!revealDialog) return;
        navigator.clipboard.writeText(revealDialog.value);
        setCopied(true);
        toast.success('Copied to clipboard', { position: 'top-center' });
        setTimeout(() => setCopied(false), 2000);
    };

    const openDeleteConfirm = (entry: EnvironmentEntry) => {
        setConfirmInput('');
        setConfirmDeleteEntry(entry);
    };

    const handleDelete = async (entry: EnvironmentEntry) => {
        setConfirmDeleteEntry(null);
        setDeletingId(entry.id);
        try {
            const { data, error } = await upsertEntry({
                variables: {
                    input: {
                        projectPublicId: project.id,
                        entry: {
                            id: entry.id,
                            key: entry.key,
                            type: ProjectContextValueType.SECURE,
                            value: entry.value,
                            isDeleted: true,
                        },
                    },
                },
                errorPolicy: 'all'
            });

            if (hasGraphQLError(error)) {
                const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

                if (gqlError) {
                    const err = gqlError.extensions?.originalError as
                        | Record<string, any>
                        | undefined;

                    if (err?.id === "ENVIRONMENT_ADMIN_ENTRY_NOT_EDITABLE") {
                        toast.error('This entry is managed by an admin and cannot be removed.', { position: 'top-center' });
                        return;
                    }
                }
            }

            if (data) {
                client.refetchQueries({ include: ["GetProjectForForge"] });
                toast.success('Entry removed.', { position: 'top-center' });
            }
        } catch {
            toast.error('Failed to remove entry.', { position: 'top-center' });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex w-full flex-col gap-6 py-2">
            <div>
                <h2 className="text-base font-semibold">Context</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    Environment variables and configuration for this project.
                </p>
            </div>

            <section className="bg-card overflow-hidden rounded-xl border shadow-sm">
                <div className="bg-muted/30 border-b px-4 py-3 sm:px-5">
                    <h2 className="text-base font-semibold">Environment Variables</h2>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        Key-value entries shared with the project context.
                    </p>
                </div>

                {entries.length === 0 ? (
                    <p className="text-muted-foreground px-4 py-8 text-center text-sm sm:px-5">
                        No environment variables yet.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-4 sm:px-5 w-[25%]">Key</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead className="w-20">Owner</TableHead>
                                <TableHead className="w-20">Secured</TableHead>
                                <TableHead className="w-[130px]">Created</TableHead>
                                <TableHead className="w-[130px]">Updated</TableHead>
                                <TableHead className="w-20 text-center px-4 sm:px-5">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entries.map((entry) => {
                                const isSecure = entry.type === ProjectContextValueType.SECURE || entry.type === "secure"
                                const isDeleting = deletingId === entry.id;

                                return (
                                    <TableRow className="hover:bg-muted/30 transition-colors" key={entry.id}>
                                        <TableCell className="px-4 sm:px-5 font-mono text-sm font-medium">
                                            {entry.key}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <span className="text-muted-foreground font-mono text-xs">
                                                    {truncateWord(entry.value)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={entry.isAdminOwned ? 'outline' : 'secondary'} className="text-xs">
                                                {entry.isAdminOwned ? 'Admin' : 'User'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex h-full min-h-8 items-center justify-center gap-2">
                                                {isSecure ? (
                                                    <ShieldCheckIcon className="mx-auto size-4 text-green-600" />
                                                ) : <ShieldXIcon className="mx-auto size-4" />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs">
                                            {formatDateTime(entry.createdAt, { format: 'dd MMM yyyy' })}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs">
                                            {formatDateTime(entry.updatedAt, { format: 'dd MMM yyyy' })}
                                        </TableCell>
                                        <TableCell className="px-4 sm:px-5">
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            disabled={!!deletingId || revealingId === entry.id}
                                                        >
                                                            {isDeleting || revealingId === entry.id ? (
                                                                <Loader2Icon className="size-3.5 animate-spin" />
                                                            ) : (
                                                                <MoreVerticalIcon className="size-3.5" />
                                                            )}
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onSelect={() => handleReveal(entry)}>
                                                            <EyeIcon className="size-3.5" />
                                                            Reveal
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() => setEditEntry(entry)}
                                                            disabled={entry.isAdminOwned && !isKubisTeam}
                                                        >
                                                            <PencilIcon className="size-3.5" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() => openDeleteConfirm(entry)}
                                                            disabled={entry.isAdminOwned && !isKubisTeam}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2Icon className="size-3.5" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </section>

            {editEntry && (
                <EditContextEntryDialog
                    open={!!editEntry}
                    onOpenChange={(open) => {
                        if (!open) setEditEntry(null);
                    }}
                    projectPublicId={project.id}
                    entry={editEntry}
                />
            )}

            <Dialog open={!!revealDialog} onOpenChange={(open) => !open && setRevealDialog(null)}>
                <DialogContent
                    className="sm:max-w-[560px]"
                    showCloseButton={false}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-2">
                            <DialogTitle>Environment Value</DialogTitle>
                            <Badge variant="secondary" className="mt-0.5 flex shrink-0 items-center gap-1.5 text-xs font-normal">
                                <ShieldCheckIcon className="size-3 text-green-600" />
                                Secure Session
                            </Badge>
                        </div>
                        <DialogDescription>
                            <span className="font-mono text-sm font-medium text-foreground">
                                {revealDialog?.entry.key}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="w-full overflow-hidden rounded-xl border bg-muted/40 p-4 max-h-80 overflow-y-auto scrollbar-hide">
                        <code className="block break-all font-mono text-sm leading-6">
                            {revealDialog?.value ?? ''}
                        </code>
                    </div>

                    <div className="flex items-start gap-2 rounded-lg border bg-amber-50 px-3 py-2.5 dark:bg-amber-950/30">
                        <ShieldAlertIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            Handle revealed environment carefully. Anyone with access to this value may access external services.
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setRevealDialog(null)}>
                            Close
                        </Button>
                        <Button onClick={handleCopy}>
                            {copied ? (
                                <CheckIcon className="size-4" />
                            ) : (
                                <CopyIcon className="size-4" />
                            )}
                            {copied ? 'Copied!' : 'Copy Secret'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!confirmDeleteEntry}
                onOpenChange={(open) => !open && setConfirmDeleteEntry(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Entry</DialogTitle>
                        <DialogDescription>
                            You are about to delete{' '}
                            <span className="text-foreground font-medium">
                                {confirmDeleteEntry?.key}
                            </span>
                            . This action cannot be undone. Type{' '}
                            <span className="text-foreground font-medium">
                                {confirmDeleteEntry?.key}
                            </span>{' '}
                            to confirm.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="confirm-entry-key" className="text-sm">
                            Entry key
                        </Label>
                        <Input
                            id="confirm-entry-key"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder={confirmDeleteEntry?.key}
                            autoComplete="off"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteEntry(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={confirmInput !== confirmDeleteEntry?.key}
                            onClick={() => confirmDeleteEntry && handleDelete(confirmDeleteEntry)}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
