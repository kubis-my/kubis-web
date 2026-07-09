'use client';

import { Button } from '@/shadcn/components/button';
import { Calendar } from '@/shadcn/components/calendar';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shadcn/components/dialog';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/popover';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { IconPlus } from '@tabler/icons-react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import {
    CreateMilestoneInput,
    Milestone,
} from '@repo/commons/types/forge-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
const CREATE_MILESTONE: TypedDocumentNode<
    { createMilestoneForForge: Milestone },
    { input: CreateMilestoneInput }
> = gql`
    mutation CreateMilestoneForForge($input: CreateMilestoneInput!) {
        createMilestoneForForge(input: $input) {
            publicId
            name
            status
            estimatedAt
            order
        }
    }
`;

export function CreateMilestoneDialog({
    projectPublicId,
    order,
}: {
    projectPublicId: string;
    order: number;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [estimatedAt, setEstimatedAt] = useState<Date | undefined>(undefined);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const [createMilestone, { loading }] = useMutation(CREATE_MILESTONE);

    const resetForm = useCallback(() => {
        setName('');
        setEstimatedAt(undefined);
        setFormValidation({});
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setFormValidation({});

            try {
                const input: CreateMilestoneInput = {
                    projectPublicId,
                    name,
                    estimatedAt: estimatedAt ? format(estimatedAt, 'yyyy-MM-dd') : undefined,
                    order,
                };

                const { data, error } = await createMilestone({
                    variables: { input },
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

                        const id = err?.id;

                        if (
                            err?.statusCode === 409 &&
                            id === 'MILESTONE_NAME_ALREADY_EXISTS'
                        ) {
                            setFormValidation({
                                name: [
                                    'A milestone with this name already exists.',
                                ],
                            });
                            return;
                        }
                    }

                    toast.error('Something went wrong. Please try again.', {
                        position: 'top-center',
                    });
                    return;
                }

                if (data) {
                    toast.success('Milestone created successfully!', {
                        position: 'top-center',
                    });
                    resetForm();
                    setOpen(false);
                }
            } catch {
                toast.error('Network error occurred. Please check your connection.', {
                    position: 'top-center',
                });
            }
        },
        [name, estimatedAt, projectPublicId, order, createMilestone, resetForm],
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
                if (!value) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                    <IconPlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Milestone</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new milestone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="milestone-name">Name</Label>
                            <Input
                                id="milestone-name"
                                placeholder="Milestone name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                autoComplete="off"
                            />
                            <ShowErrorText error={formValidation} field="name" />
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
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={loading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {!loading ? (
                                'Create'
                            ) : (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Creating...
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
