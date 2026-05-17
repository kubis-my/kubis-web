export function RichTextView({ html, emptyMessage }: { html: string; emptyMessage: string }) {
    if (!html) return <p className="text-sm italic text-muted-foreground">{emptyMessage}</p>;

    return (
        <div
            className="prose-editor text-sm leading-6 text-foreground/90"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
