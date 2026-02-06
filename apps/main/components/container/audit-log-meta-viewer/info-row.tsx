import React from "react";

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
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="truncate font-medium">{children}</div>
            </div>
        </div>
    );
}
