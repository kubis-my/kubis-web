export function DateSeparator({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 px-4 py-5 md:px-6">
            <div className="via-border to-border/30 h-px flex-1 bg-linear-to-r from-transparent" />
            <span className="border-border/80 bg-background/95 text-muted-foreground rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase shadow-xs">
                {label}
            </span>
            <div className="via-border to-border/30 h-px flex-1 bg-linear-to-l from-transparent" />
        </div>
    );
}
