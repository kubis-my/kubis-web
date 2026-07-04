import { useMemo } from 'react';
import { richTextToHtml } from '@repo/shadcn-ui/components/rich-text-editor';

export function RichTextView({ content, emptyMessage }: { content: object | null; emptyMessage: string }) {
    const html = useMemo(() => richTextToHtml(content), [content]);

    if (!content) return <p className="text-muted-foreground text-sm italic">{emptyMessage}</p>;

    return (
        <div
            className="prose-editor text-foreground/90 text-sm leading-6"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
