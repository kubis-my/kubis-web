import { memo, useMemo } from 'react';
import { richTextToHtml } from '@repo/shadcn-ui/components/rich-text-editor';

export default memo(function MilestoneNoteContent({ content }: { content: object | null }) {
    const html = useMemo(() => richTextToHtml(content), [content]);

    return (
        <div className="prose-editor text-sm leading-6" dangerouslySetInnerHTML={{ __html: html }} />
    );
});
