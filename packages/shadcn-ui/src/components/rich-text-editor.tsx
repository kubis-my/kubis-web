'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@repo/shadcn-ui/lib/utils';
import {
    IconBold,
    IconItalic,
    IconList,
    IconListNumbers,
    IconH2,
    IconH3,
} from '@tabler/icons-react';

type ToolbarButtonProps = {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
};

function ToolbarButton({ onClick, isActive, children, title }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={cn(
                'flex size-7 items-center justify-center rounded text-sm transition-colors',
                isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
        >
            {children}
        </button>
    );
}

type RichTextEditorProps = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
};

export default function RichTextEditor({
    value,
    onChange,
    placeholder,
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Write something...',
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose-editor min-h-[120px] px-3 py-2 text-sm focus:outline-none',
            },
        },
        onUpdate({ editor }) {
            const html = editor.isEmpty ? '' : editor.getHTML();
            onChange(html);
        },
        immediatelyRender: false,
    });

    if (!editor) return null;

    return (
        <div
            className={cn(
                'rounded-md border border-input bg-background shadow-xs transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
                className,
            )}
        >
            <div className="flex items-center gap-0.5 border-b px-2 py-1.5">
                <ToolbarButton
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <IconBold size={14} />
                </ToolbarButton>

                <ToolbarButton
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <IconItalic size={14} />
                </ToolbarButton>

                <div className="mx-1 h-4 w-px bg-border" />

                <ToolbarButton
                    title="Heading 2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <IconH2 size={14} />
                </ToolbarButton>

                <ToolbarButton
                    title="Heading 3"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                >
                    <IconH3 size={14} />
                </ToolbarButton>

                <div className="mx-1 h-4 w-px bg-border" />

                <ToolbarButton
                    title="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <IconList size={14} />
                </ToolbarButton>

                <ToolbarButton
                    title="Numbered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                >
                    <IconListNumbers size={14} />
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
