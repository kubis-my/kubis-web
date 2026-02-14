import React from 'react';

export function InfoRow({
    icon: Icon,
    label,
    children,
}: {
    icon: React.ElementType;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
                <Icon className="text-muted-foreground size-3.5" />
            </div>
            <div className="min-w-0">
                <p className="text-muted-foreground text-xs">{label}</p>
                <div className="truncate font-medium">{children}</div>
            </div>
        </div>
    );
}
