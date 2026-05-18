export function TextField({ value, emptyMessage }: { value: string; emptyMessage: string }) {
    if (!value) return <p className="text-muted-foreground text-sm italic">{emptyMessage}</p>;

    return <p className="text-foreground/90 text-sm leading-6">{value}</p>;
}
