'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { generateHTML } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

const renderExtensions = [
    StarterKit.configure({ heading: { levels: [2, 3] } }),
    Link.configure({ openOnClick: false, autolink: true }),
];

export function richTextToHtml(json: object | null): string {
    if (!json) return '';
    try {
        return generateHTML(json as Parameters<typeof generateHTML>[0], renderExtensions);
    } catch {
        return '';
    }
}
import { cn } from '@repo/shadcn-ui/lib/utils';
import { Button } from '@repo/shadcn-ui/components/button';
import { Input } from '@repo/shadcn-ui/components/input';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@repo/shadcn-ui/components/dialog';
import {
    IconBold,
    IconItalic,
    IconList,
    IconListNumbers,
    IconH2,
    IconH3,
    IconLink,
    IconExternalLink,
    IconPencil,
    IconTrash,
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
    value: object | null;
    onChange: (value: object | null) => void;
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
        const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
        const [linkText, setLinkText] = React.useState('');
        const [linkHref, setLinkHref] = React.useState('');
        const [linkBubble, setLinkBubble] = React.useState<{
            href: string;
            top: number;
            left: number;
        } | null>(null);

        const editor = useEditor({
            extensions: [
                StarterKit.configure({
                    heading: { levels: [2, 3] },
                }),
                Placeholder.configure({
                    placeholder: placeholder ?? 'Write something...',
                }),
                Link.extend({ inclusive: false }).configure({
                    openOnClick: false,
                    autolink: true,
                }),
            ],
            content: value ?? '',
            editorProps: {
                attributes: {
                    class:
                        editorClassName ??
                        'prose-editor min-h-[120px] px-3 py-2 text-sm focus:outline-none',
                },
                handleClick: (_view: unknown, _pos: unknown, event: MouseEvent): boolean => {
                    const target = event.target as HTMLElement;
                    if (target.closest('a')) {
                        event.preventDefault();
                        return true;
                    }
                    return false;
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
                const json = editor.isEmpty || !editor.getText().trim() ? null : editor.getJSON();
                onChange(json);
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

        React.useEffect(() => {
            if (!editor) return;

            function syncBubble() {
                if (!editor || !editor.isFocused || !editor.isActive('link')) {
                    setLinkBubble(null);
                    return;
                }
                const { from } = editor.state.selection;
                const coords = editor.view.coordsAtPos(from);
                setLinkBubble({
                    href: editor.getAttributes('link').href ?? '',
                    top: coords.bottom,
                    left: coords.left,
                });
            }

            editor.on('selectionUpdate', syncBubble);
            editor.on('blur', () => setLinkBubble(null));

            return () => {
                editor.off('selectionUpdate', syncBubble);
                editor.off('blur', () => setLinkBubble(null));
            };
        }, [editor]);

        function openLinkDialog() {
            if (!editor) return;
            if (editor.isActive('link')) {
                editor.commands.extendMarkRange('link');
            }
            const { from, to } = editor.state.selection;
            setLinkText(editor.state.doc.textBetween(from, to));
            setLinkHref(editor.getAttributes('link').href ?? '');
            setLinkDialogOpen(true);
        }

        function openLinkHref() {
            const href = editor?.getAttributes('link').href;
            if (href) window.open(href, '_blank', 'noopener,noreferrer');
        }

        function saveLinkDialog() {
            if (!editor) return;
            if (!linkHref) {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
            } else if (linkText) {
                editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .insertContent({
                        type: 'text',
                        text: linkText,
                        marks: [{ type: 'link', attrs: { href: linkHref } }],
                    })
                    .run();
            } else {
                editor.chain().focus().extendMarkRange('link').setLink({ href: linkHref }).run();
            }
            setLinkDialogOpen(false);
        }

        if (!editor) return null;

        return (
            <>
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

                        <div className="bg-border mx-1 h-4 w-px" />

                        <ToolbarButton
                            title="Link"
                            onClick={openLinkDialog}
                            isActive={editor.isActive('link')}
                        >
                            <IconLink size={14} />
                        </ToolbarButton>

                        {toolbarRightContent ? (
                            <div className="ml-auto flex items-center pl-2">{toolbarRightContent}</div>
                        ) : null}
                    </div>

                    <EditorContent editor={editor} />
                </div>

                {linkBubble &&
                    createPortal(
                        <div
                            style={{
                                position: 'fixed',
                                top: linkBubble.top + 6,
                                left: linkBubble.left,
                                zIndex: 50,
                            }}
                            className="bg-popover text-popover-foreground border-border flex items-center gap-1 rounded-md border px-1.5 py-1 shadow-md text-xs"
                        >
                            <span className="text-muted-foreground max-w-[180px] truncate px-1">
                                {linkBubble.href}
                            </span>
                            <div className="bg-border mx-0.5 h-4 w-px" />
                            <button
                                type="button"
                                title="Open link"
                                className="text-muted-foreground hover:text-foreground flex size-6 items-center justify-center rounded transition-colors hover:bg-muted"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={openLinkHref}
                            >
                                <IconExternalLink size={13} />
                            </button>
                            <button
                                type="button"
                                title="Edit link"
                                className="text-muted-foreground hover:text-foreground flex size-6 items-center justify-center rounded transition-colors hover:bg-muted"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={openLinkDialog}
                            >
                                <IconPencil size={13} />
                            </button>
                            <button
                                type="button"
                                title="Remove link"
                                className="text-muted-foreground hover:text-destructive flex size-6 items-center justify-center rounded transition-colors hover:bg-muted"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => editor.chain().focus().unsetLink().run()}
                            >
                                <IconTrash size={13} />
                            </button>
                        </div>,
                        document.body,
                    )}

                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit link</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4 py-2">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium">Text</label>
                                <Input
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Link text"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium">Link</label>
                                <Input
                                    value={linkHref}
                                    onChange={(e) => setLinkHref(e.target.value)}
                                    placeholder="https://"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveLinkDialog();
                                    }}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={saveLinkDialog}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    },
);

export default RichTextEditor;
