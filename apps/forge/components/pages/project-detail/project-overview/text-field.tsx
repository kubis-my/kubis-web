export function TextField({ value, emptyMessage }: { value: string; emptyMessage: string }) {
    if (!value) return <p className="text-sm italic text-muted-foreground">{emptyMessage}</p>;

    return <p className="text-sm leading-6 text-foreground/90">{value}</p>;
}
