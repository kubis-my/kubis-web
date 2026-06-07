'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/shadcn/components/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/shadcn/components/dialog';
import { type EnvironmentEntry } from '@repo/commons/types/forge-service-schema.type';
import { EntryDialogForm } from './entry-dialog-form';

export function AddContextEntryDialog({ projectPublicId }: { projectPublicId: string }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                    <IconPlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <EntryDialogForm
                    projectPublicId={projectPublicId}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

export function EditContextEntryDialog({
    open,
    onOpenChange,
    projectPublicId,
    entry,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectPublicId: string;
    entry: EnvironmentEntry;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <EntryDialogForm
                    projectPublicId={projectPublicId}
                    entry={entry}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
