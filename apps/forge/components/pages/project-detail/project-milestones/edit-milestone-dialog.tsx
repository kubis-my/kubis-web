'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shadcn/components/alert-dialog';
import { Button } from '@/shadcn/components/button';
import { Calendar } from '@/shadcn/components/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shadcn/components/dialog';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shadcn/components/select';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import {
    MilestoneStatus as GqlMilestoneStatus,
    UpdateMilestoneInput,
    Milestone as GqlMilestone,
} from '@repo/commons/types/forge-service-schema.type';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { useFormDirty } from '@repo/commons/hooks/use-form-dirty';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2Icon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Milestone } from '../project-detail-container';
import type { MilestoneStatus } from '../../project-root/types';

const UPDATE_MILESTONE: TypedDocumentNode<
    { updateMilestoneForForge: GqlMilestone },
    { publicId: string; input: UpdateMilestoneInput }
> = gql`
    mutation UpdateMilestoneForForge($publicId: String!, $input: UpdateMilestoneInput!) {
        updateMilestoneForForge(publicId: $publicId, input: $input) {
            publicId
            name
            status
            estimatedAt
            order
        }
    }
`;

const STATUS_TO_GQL: Record<MilestoneStatus, GqlMilestoneStatus> = {
    Upcoming: GqlMilestoneStatus.UPCOMING,
    'In Progress': GqlMilestoneStatus.IN_PROGRESS,
    Done: GqlMilestoneStatus.DONE,
    Cancelled: GqlMilestoneStatus.CANCELLED,
};

const ALL_STATUSES: MilestoneStatus[] = ['Upcoming', 'In Progress', 'Done', 'Cancelled'];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    milestone: Milestone;
};

export function EditMilestoneDialog({ open, onOpenChange, milestone }: Props) {
    const [name, setName] = useState(milestone.name);
    const [status, setStatus] = useState<MilestoneStatus>(milestone.status);
    const [estimatedAt, setEstimatedAt] = useState<Date | undefined>(
        milestone.estimatedDate ? parseISO(milestone.estimatedDate) : undefined,
    );
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [confirmOpen, setConfirmOpen] = useState(false);

    const formData = { name, status, estimatedAt: estimatedAt ? format(estimatedAt, 'yyyy-MM-dd') : null };
    const { isDirty, setOriginal } = useFormDirty(formData);

    const [updateMilestone, { loading }] = useMutation(UPDATE_MILESTONE);

    useEffect(() => {
        if (open) {
            const date = milestone.estimatedDate ? parseISO(milestone.estimatedDate) : undefined;
            setName(milestone.name);
            setStatus(milestone.status);
            setEstimatedAt(date);
            setFormValidation({});
            setOriginal({ name: milestone.name, status: milestone.status, estimatedAt: date ? format(date, 'yyyy-MM-dd') : null });
        }
    }, [open, milestone]);

    function handleRequestClose() {
        if (isDirty) {
            setConfirmOpen(true);
        } else {
            onOpenChange(false);
        }
    }

    function handleConfirmDiscard() {
        setConfirmOpen(false);
        onOpenChange(false);
    }

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setFormValidation({});

            try {
                const input: UpdateMilestoneInput = {
                    name,
                    status: STATUS_TO_GQL[status],
                    estimatedAt: estimatedAt ? format(estimatedAt, 'yyyy-MM-dd') : null,
                };

                const { data, error } = await updateMilestone({
                    variables: { publicId: milestone.id, input },
                    errorPolicy: 'all',
                    refetchQueries: ['GetProjectForForge'],
                });

                if (hasGraphQLError(error)) {
                    const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

                    if (gqlError) {
                        const err = gqlError.extensions?.originalError as
                            | Record<string, any>
                            | undefined;

                        if (err?.statusCode === 400 && Array.isArray(err?.message)) {
                            setFormValidation(
                                convertErrorMessageListToObject(Object.keys(input), err.message),
                            );
                            return;
                        }

                        if (err?.statusCode === 409 && err?.id === 'MILESTONE_NAME_ALREADY_EXISTS') {
                            setFormValidation({ name: ['A milestone with this name already exists.'] });
                            return;
                        }
                    }
                }

                if (data) {
                    toast.success('Milestone updated successfully!', { position: 'top-center' });
                    onOpenChange(false);
                    return;
                }

                toast.error('An unexpected error occurred. Please try again.', {
                    position: 'top-center',
                });
            } catch {
                toast.error('Network error occurred. Please check your connection.', {
                    position: 'top-center',
                });
            }
        },
        [name, status, estimatedAt, milestone.id, updateMilestone, onOpenChange],
    );

    return (
        <>
        <Dialog open={open} onOpenChange={(val) => { if (!val) handleRequestClose(); }}>
            <DialogContent
                className="sm:max-w-[425px]"
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                    if (!confirmOpen) handleRequestClose();
                }}
                onInteractOutside={(e) => {
                    e.preventDefault();
                    if (!confirmOpen) handleRequestClose();
                }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Milestone</DialogTitle>
                        <DialogDescription>Update the details for this milestone.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-milestone-name">Name</Label>
                            <Input
                                id="edit-milestone-name"
                                placeholder="Milestone name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                autoComplete="off"
                            />
                            <ShowErrorText error={formValidation} field="name" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                value={status}
                                onValueChange={(val) => setStatus(val as MilestoneStatus)}
                                disabled={loading}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_STATUSES.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <ShowErrorText error={formValidation} field="status" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Estimated Date</Label>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-start font-normal"
                                        disabled={loading}
                                    >
                                        <CalendarIcon className="mr-2 size-4" />
                                        {estimatedAt ? (
                                            format(estimatedAt, 'PPP')
                                        ) : (
                                            <span className="text-muted-foreground">Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={estimatedAt}
                                        onSelect={(date) => {
                                            setEstimatedAt(date);
                                            setCalendarOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <ShowErrorText error={formValidation} field="estimatedAt" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={handleRequestClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!isDirty || loading}>
                            {!loading ? (
                                'Save'
                            ) : (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Saving...
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You have unsaved changes. Closing will discard them permanently.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep editing</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDiscard}>Discard</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
