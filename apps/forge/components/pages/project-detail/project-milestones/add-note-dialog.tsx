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
} from '@/shadcn/components/dialog';
import { Label } from '@/shadcn/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/popover';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import {
    AddMilestoneNoteInput,
    MilestoneNote,
} from '@repo/commons/types/forge-service-schema.type';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import RichTextEditor from '@repo/shadcn-ui/components/rich-text-editor';
import { format } from 'date-fns';
import { CalendarIcon, Loader2Icon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const ADD_MILESTONE_NOTE: TypedDocumentNode<
    { addMilestoneNoteForForge: MilestoneNote },
    { input: AddMilestoneNoteInput }
> = gql`
    mutation AddMilestoneNoteForForge($input: AddMilestoneNoteInput!) {
        addMilestoneNoteForForge(input: $input) {
            publicId
            content
            date
        }
    }
`;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    milestonePublicId: string;
};

export function AddNoteDialog({ open, onOpenChange, milestonePublicId }: Props) {
    const [content, setContent] = useState<object | null>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

    const [addNote, { loading }] = useMutation(ADD_MILESTONE_NOTE);

    useEffect(() => {
        if (open) {
            setContent(null);
            setDate(new Date());
            setFormValidation({});
        }
    }, [open]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setFormValidation({});

            if (!date) {
                setFormValidation({ date: ['Please select a date.'] });
                return;
            }

            try {
                const input: AddMilestoneNoteInput = {
                    milestonePublicId,
                    content,
                    date: format(date, 'yyyy-MM-dd'),
                };

                const { data, error } = await addNote({
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
                    }

                    toast.error('Something went wrong. Please try again.', {
                        position: 'top-center',
                    });
                    return;
                }

                if (data) {
                    toast.success('Note added successfully!', { position: 'top-center' });
                    onOpenChange(false);
                }
            } catch {
                toast.error('Network error occurred. Please check your connection.', {
                    position: 'top-center',
                });
            }
        },
        [content, date, milestonePublicId, addNote, onOpenChange],
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Note</DialogTitle>
                        <DialogDescription>Add an update note to this milestone.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-start font-normal"
                                        disabled={loading}
                                    >
                                        <CalendarIcon className="mr-2 size-4" />
                                        {date ? (
                                            format(date, 'PPP')
                                        ) : (
                                            <span className="text-muted-foreground">Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => {
                                            setDate(d);
                                            setCalendarOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <ShowErrorText error={formValidation} field="date" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Note</Label>
                            <div className="border rounded-lg overflow-hidden">
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Write a milestone update..."
                                />
                            </div>
                            <ShowErrorText error={formValidation} field="content" />
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
                                'Add Note'
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
    );
}
