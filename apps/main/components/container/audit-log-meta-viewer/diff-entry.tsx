import { ArrowRight, Minus, Plus } from 'lucide-react';

export function DiffEntry({
    entryKey,
    before,
    after,
}: {
    entryKey: string;
    before?: string;
    after?: string;
}) {
    const isAdded = before === undefined;
    const isRemoved = after === undefined;

    return (
        <div className="group hover:bg-muted/50 flex items-start gap-3 rounded-md px-3 py-2 transition-colors">
            <div className="mt-0.5 shrink-0">
                {isAdded ? (
                    <Plus className="size-3.5 text-green-500" />
                ) : isRemoved ? (
                    <Minus className="size-3.5 text-red-500" />
                ) : (
                    <ArrowRight className="size-3.5 text-blue-500" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <span className="text-muted-foreground font-mono text-xs">{entryKey}</span>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                    {before !== undefined && (
                        <span
                            className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-xs ${
                                isRemoved
                                    ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400'
                                    : 'border-muted bg-muted text-muted-foreground line-through'
                            }`}
                        >
                            {before || <span className="italic">empty</span>}
                        </span>
                    )}
                    {before !== undefined && after !== undefined && (
                        <ArrowRight className="text-muted-foreground/50 size-3 shrink-0" />
                    )}
                    {after !== undefined && (
                        <span
                            className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-xs ${
                                isAdded
                                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400'
                                    : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400'
                            }`}
                        >
                            {after || <span className="italic">empty</span>}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
