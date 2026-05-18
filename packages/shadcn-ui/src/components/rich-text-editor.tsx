'use client';

import * as React from 'react';
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
                'flex size-8 items-center justify-center rounded-md text-sm transition-colors',
                isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
        >
            {children}
        </button>
    );
}

export type RichTextEditorRef = {
    clear: () => void;
    focus: () => void;
};

type RichTextEditorProps = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    editorClassName?: string;
    onSubmit?: () => void;
    toolbarRightContent?: React.ReactNode;
};

const RichTextEditor = React.forwardRef<RichTextEditorRef, RichTextEditorProps>(
    function RichTextEditor(
        { value, onChange, placeholder, className, editorClassName, onSubmit, toolbarRightContent },
        ref,
    ) {
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
                    class:
                        editorClassName ??
                        'prose-editor min-h-[120px] px-3 py-2 text-sm focus:outline-none',
                },
                handleKeyDown: (_: unknown, event: KeyboardEvent): boolean => {
                    if (onSubmit && event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                        onSubmit();
                        return true;
                    }
                    return false;
                },
            },
            onUpdate({ editor }) {
                const html = editor.isEmpty || !editor.getText().trim() ? '' : editor.getHTML();
                onChange(html);
            },
            immediatelyRender: false,
        });

        React.useImperativeHandle(
            ref,
            () => ({
                clear: () => {
                    editor?.commands.clearContent(true);
                },
                focus: () => {
                    editor?.commands.focus();
                },
            }),
            [editor],
        );

        if (!editor) return null;

        return (
            <div
                className={cn(
                    'border-input bg-background focus-within:border-ring focus-within:ring-ring/35 rounded-lg border shadow-xs transition-colors focus-within:ring-[3px]',
                    className,
                )}
            >
                <div className="border-border/80 bg-muted/20 flex items-center gap-0.5 border-b px-2 py-1.5">
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

                    <div className="bg-border mx-1 h-4 w-px" />

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

                    <div className="bg-border mx-1 h-4 w-px" />

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

                    {toolbarRightContent ? (
                        <div className="ml-auto flex items-center pl-2">{toolbarRightContent}</div>
                    ) : null}
                </div>

                <EditorContent editor={editor} />
            </div>
        );
    },
);

export default RichTextEditor;
