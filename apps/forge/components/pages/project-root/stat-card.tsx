import { type ReactNode } from 'react';
import { Card, CardContent } from '@repo/shadcn-ui/components/card';
import { cn } from '@repo/shadcn-ui/lib/utils';

type StatCardProps = {
    label: string;
    value: string | number;
    sub: ReactNode;
    icon: ReactNode;
    iconClass: string;
    ring?: boolean;
};

export function StatCard({ label, value, sub, icon, iconClass, ring }: StatCardProps) {
    return (
        <Card
            className={cn(
                'rounded-2xl py-0 transition-shadow duration-200 hover:shadow-md',
                ring && 'ring-1 ring-amber-300 dark:ring-amber-700/60',
            )}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-muted-foreground text-xs font-medium">{label}</p>
                    <div
                        className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm',
                            iconClass,
                        )}
                    >
                        {icon}
                    </div>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
                <div className="text-muted-foreground mt-1.5 text-xs">{sub}</div>
            </CardContent>
        </Card>
    );
}
