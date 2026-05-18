export function RichTextView({ html, emptyMessage }: { html: string; emptyMessage: string }) {
    if (!html) return <p className="text-muted-foreground text-sm italic">{emptyMessage}</p>;

    return (
        <div
            className="prose-editor text-foreground/90 text-sm leading-6"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
