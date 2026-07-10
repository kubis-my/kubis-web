'use client';

import * as React from 'react';
import { cn } from '@repo/shadcn-ui/lib/utils';

type Props = {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
};

export default function ToolbarButton({ onClick, isActive, disabled, children, title }: Props) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'flex size-8 items-center justify-center rounded-md text-sm transition-colors',
                'disabled:pointer-events-none disabled:opacity-50',
                isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
        >
            {children}
        </button>
    );
}
