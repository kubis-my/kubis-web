'use client';

import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconChevronDown, IconPlus } from '@tabler/icons-react';
import { cn } from '@repo/shadcn-ui/lib/utils';

type Props = {
    categories: string[];
    value: string;
    onChange: (value: string) => void;
    onAddCategory: (category: string) => void;
};

export function CategorySelect({ categories, value, onChange, onAddCategory }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const trimmed = search.trim();
    const filtered = categories.filter((cat) => cat.toLowerCase().includes(trimmed.toLowerCase()));
    const canCreate =
        trimmed.length > 0 &&
        !categories.some((cat) => cat.toLowerCase() === trimmed.toLowerCase());

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                handleClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleOpen() {
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    function handleClose() {
        setOpen(false);
        setSearch('');
    }

    function handleSelect(cat: string) {
        onChange(cat);
        handleClose();
    }

    function handleCreate() {
        if (!canCreate) return;

        onAddCategory(trimmed);
        onChange(trimmed);
        handleClose();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered.length === 1) {
                handleSelect(filtered[0]!);
            } else if (canCreate) {
                handleCreate();
            }
        } else if (e.key === 'Escape') {
            handleClose();
        }
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={handleOpen}
                className={cn(
                    'border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
                    !value && 'text-muted-foreground',
                )}
            >
                <span>{value || 'Select category'}</span>
                <IconChevronDown className="size-4 shrink-0 opacity-50" />
            </button>

            {open && (
                <div className="bg-popover text-popover-foreground absolute z-50 mt-1 w-full rounded-md border shadow-md">
                    <div className="p-2">
                        <input
                            ref={inputRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search or create..."
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-8 w-full rounded-md border bg-transparent px-2 text-sm outline-none focus-visible:ring-[3px]"
                        />
                    </div>

                    <div className="max-h-48 overflow-y-auto px-1 pb-1">
                        {filtered.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleSelect(cat)}
                                className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                            >
                                <IconCheck
                                    className={cn(
                                        'size-4 shrink-0',
                                        value === cat ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                                {cat}
                            </button>
                        ))}

                        {filtered.length === 0 && !canCreate && (
                            <p className="text-muted-foreground px-2 py-3 text-center text-xs">
                                No categories found.
                            </p>
                        )}

                        {canCreate && (
                            <button
                                type="button"
                                onClick={handleCreate}
                                className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                            >
                                <IconPlus className="size-4 shrink-0" />
                                Create &ldquo;{trimmed}&rdquo;
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
