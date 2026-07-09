'use client';

import { useCallback, useState } from 'react';
import { useFormDirty } from '@repo/commons/hooks/use-form-dirty';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { Button } from '@/shadcn/components/button';
import {
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shadcn/components/dialog';
import { Input } from '@/shadcn/components/input';
import { Textarea } from '@/shadcn/components/textarea';
import { Label } from '@/shadcn/components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shadcn/components/select';
import {
    ProjectContextValueType,
    UpsertProjectContextEnvironmentInput,
    type EnvironmentEntry,
} from '@repo/commons/types/forge-service-schema.type';
import { UPSERT_CONTEXT_ENVIRONMENT } from './graphql';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';

export type EntryFormState = {
    key: string;
    type: ProjectContextValueType;
    value: string;
};

export const EMPTY_FORM: EntryFormState = {
    key: '',
    type: ProjectContextValueType.STRING,
    value: '',
};

export function EntryDialogForm({
    projectPublicId,
    entry,
    onSuccess,
}: {
    projectPublicId: string;
    entry?: EnvironmentEntry;
    onSuccess: () => void;
}) {
    const client = useApolloClient();
    const isEdit = !!entry;

    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [form, setForm] = useState<EntryFormState>(
        entry
            ? { key: entry.key, type: entry.type as ProjectContextValueType, value: '' }
            : EMPTY_FORM,
    );

    const { isDirty } = useFormDirty(form);

    const [upsertEntry, { loading }] = useMutation(UPSERT_CONTEXT_ENVIRONMENT);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                const input: UpsertProjectContextEnvironmentInput = {
                    projectPublicId,
                    entry: {
                        ...(isEdit && { id: entry.id }),
                        key: form.key.trim().replace(/_+$/, ''),
                        type: getTypeEnum(form.type),
                        value: isEdit && !form.value ? undefined : form.value,
                    },
                }
                const { data, error } = await upsertEntry({
                    variables: {
                        input
                    },
                    errorPolicy: 'all',
                });

                if (hasGraphQLError(error)) {
                    const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

                    if (gqlError) {
                        const err = gqlError.extensions?.originalError as
                            | Record<string, any>
                            | undefined;

                        if (err?.statusCode === 400 && Array.isArray(err?.message)) {
                            const errors = convertErrorMessageListToObject(Object.keys(input), err.message);
                            const entries = errors?.entry ?? [] as string[]

                            setFormValidation({
                                entry_key: entries.filter(val => val.includes("field.key")).map(val => val.replace("field.key", "field")),
                                entry_value: entries.filter(row => row.includes("field.value")).map(val => val.replace("field.value", "field")),
                            });
                            return;
                        }

                        if (err?.id === "ENVIRONMENT_KEY_ALREADY_EXISTS") {
                            setFormValidation({
                                entry_key: ["This key is already in use"]
                            });
                            return
                        }

                        if (err?.id === "ENVIRONMENT_ADMIN_ENTRY_NOT_EDITABLE") {
                            toast.error('This entry is managed by an admin and cannot be removed.', { position: 'top-center' });
                            return;
                        }
                    }

                    toast.error('Something went wrong. Please try again.', {
                        position: 'top-center',
                    });
                    return;
                }

                if (data) {
                    client.refetchQueries({ include: ["GetProjectForForge"] });
                    toast.success(isEdit ? 'Entry updated.' : 'Entry added.', {
                        position: 'top-center',
                    });
                    onSuccess();
                }
            } catch {
                toast.error('Network error occurred. Please check your connection.', {
                    position: 'top-center',
                });
            }
        },
        [form, projectPublicId, isEdit, entry, upsertEntry, onSuccess],
    );

    const getTypeEnum = (value: any) => {
        if (value === "secure" || value === "SECURE") {
            return ProjectContextValueType.SECURE
        }

        return ProjectContextValueType.STRING;
    }

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>{isEdit ? 'Edit Entry' : 'Add Entry'}</DialogTitle>
                <DialogDescription>
                    {isEdit
                        ? 'Update the key, type, or value of this entry.'
                        : 'Add a new environment variable to this project.'}
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="entry-key">Key</Label>
                    <Input
                        id="entry-key"
                        value={form.key}
                        onChange={(e) => setForm((f) => ({ ...f, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') }))}
                        placeholder="KEY_NAME"
                        disabled={loading}
                        autoComplete="off"
                        className="font-mono"
                        style={{ textTransform: 'uppercase' }}
                    />
                    <ShowErrorText field='entry_key' error={formValidation} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="entry-type">Type</Label>
                    <Select
                        value={getTypeEnum(form.type)}
                        onValueChange={(v) =>
                            setForm((f) => ({ ...f, type: v as ProjectContextValueType }))
                        }
                        disabled={loading}
                    >
                        <SelectTrigger id="entry-type" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ProjectContextValueType.STRING}>String</SelectItem>
                            <SelectItem value={ProjectContextValueType.SECURE}>Secure</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="entry-value">Value</Label>
                        {isEdit && (
                            <span className="text-xs text-muted-foreground">Leave blank to keep the current value</span>
                        )}
                    </div>
                    <Textarea
                        id="entry-value"
                        value={form.value}
                        onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                        placeholder="value"
                        disabled={loading}
                        autoComplete="off"
                        className="font-mono max-h-40 overflow-y-auto"
                        rows={3}
                    />
                    <ShowErrorText field='entry_value' error={formValidation} />
                </div>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={loading}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={!isDirty || loading}>
                    {loading ? (
                        <>
                            <Loader2Icon className="animate-spin" />
                            {isEdit ? 'Saving...' : 'Adding...'}
                        </>
                    ) : isEdit ? (
                        'Save changes'
                    ) : (
                        'Add entry'
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}
