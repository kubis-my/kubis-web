'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Avatar, AvatarFallback } from '@repo/shadcn-ui/components/avatar';
import { Button } from '@repo/shadcn-ui/components/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@repo/shadcn-ui/components/context-menu';
import RichTextEditor, {
    type RichTextEditorRef,
} from '@repo/shadcn-ui/components/rich-text-editor';
import { cn } from '@repo/shadcn-ui/lib/utils';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/shadcn/components/empty';
import {
    IconArrowDown,
    IconCornerUpLeft,
    IconFolderCode,
    IconRestore,
    IconTrash,
    IconX,
} from '@tabler/icons-react';

type Sender = {
    id: string;
    name: string;
    initials: string;
    avatarClass: string;
};

type Message = {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    replyToId?: string;
    deletedContent?: string;
    deletedAt?: Date;
};

type MessageGroup = {
    senderId: string;
    messages: Message[];
};

type DateGroup = {
    dateLabel: string;
    dateKey: string;
    groups: MessageGroup[];
};

const SENDERS: Record<string, Sender> = {
    kubis: {
        id: 'kubis',
        name: 'Kubis Team',
        initials: 'KB',
        avatarClass: 'bg-violet-500 text-white',
    },
    client: {
        id: 'client',
        name: 'Ahmad Faris',
        initials: 'AF',
        avatarClass: 'bg-sky-500 text-white',
    },
};

const MOCK_MESSAGES: Message[] = [
    {
        id: '1',
        senderId: 'client',
        content:
            "<p>Hi, I've submitted the project brief. Let me know if you need any clarification on the approval flow.</p>",
        timestamp: new Date('2026-04-30T10:31:00'),
    },
    {
        id: '2',
        senderId: 'client',
        content: '<p>Also, should I prepare any documentation from our current Excel tracker?</p>',
        timestamp: new Date('2026-04-30T10:32:00'),
    },
    {
        id: '3',
        senderId: 'kubis',
        content:
            "<p>Hi Ahmad! Thanks for the detailed brief — really helpful. We'll kick off discovery this week.</p>",
        timestamp: new Date('2026-04-30T11:05:00'),
    },
    {
        id: '4',
        senderId: 'kubis',
        content:
            "<p>Yes, please export a few sample rows from the Excel tracker. It'll help us understand the current data structure.</p>",
        timestamp: new Date('2026-04-30T11:06:00'),
    },
    {
        id: '5',
        senderId: 'kubis',
        content: '<p>No need to clean it up — raw data is fine.</p>',
        timestamp: new Date('2026-04-30T11:06:30'),
    },
    {
        id: '6',
        senderId: 'client',
        content: "<p>Sure, I'll send it over shortly.</p>",
        timestamp: new Date('2026-04-30T11:20:00'),
    },
    {
        id: '7',
        senderId: 'client',
        content: "<p>I've shared the Excel file via the drive link I sent to your email.</p>",
        timestamp: new Date('2026-05-01T09:15:00'),
    },
    {
        id: '8',
        senderId: 'kubis',
        content: '<p>Got it, thanks! A few questions before we finalise the scope:</p>',
        timestamp: new Date('2026-05-01T09:45:00'),
    },
    {
        id: '9',
        senderId: 'kubis',
        content:
            '<p>1. How many departments need the approval flow? Is it just Ops, Finance, and Management?</p>',
        timestamp: new Date('2026-05-01T09:45:30'),
    },
    {
        id: '10',
        senderId: 'kubis',
        content: '<p>2. Are there any cases where approval can skip Finance entirely?</p>',
        timestamp: new Date('2026-05-01T09:46:00'),
    },
    {
        id: '11',
        senderId: 'client',
        content: "<p>Yes, it's those 3 departments.</p>",
        timestamp: new Date('2026-05-01T10:02:00'),
    },
    {
        id: '12',
        senderId: 'client',
        content:
            '<p>And yes — for internal consumables (e.g. printer paper, stationery), Finance approval can be bypassed.</p>',
        timestamp: new Date('2026-05-01T10:03:00'),
    },
];

function toLocalDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getDateLabel(date: Date): string {
    const now = new Date();
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const msgKey = toLocalDateKey(date);

    if (msgKey === toLocalDateKey(now)) return 'Today';
    if (msgKey === toLocalDateKey(yesterdayDate)) return 'Yesterday';

    return date.toLocaleDateString('en-MY', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function groupMessages(messages: Message[]): DateGroup[] {
    const dateGroups: DateGroup[] = [];

    for (const msg of messages) {
        const dateKey = toLocalDateKey(msg.timestamp);
        const dateLabel = getDateLabel(msg.timestamp);

        let dg = dateGroups.find((g) => g.dateKey === dateKey);
        if (!dg) {
            dg = { dateLabel, dateKey, groups: [] };
            dateGroups.push(dg);
        }

        const lastGroup = dg.groups.at(-1);
        if (lastGroup && lastGroup.senderId === msg.senderId) {
            lastGroup.messages.push(msg);
        } else {
            dg.groups.push({ senderId: msg.senderId, messages: [msg] });
        }
    }

    return dateGroups;
}

const timeFormatter = new Intl.DateTimeFormat('en-MY', { hour: '2-digit', minute: '2-digit' });
const deletedAtFormatter = new Intl.DateTimeFormat('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

function getPlainTextFromHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function DateSeparator({ label }: { label: string }) {
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

function ReplyPreview({
    message,
    className,
    onClick,
}: {
    message?: Message;
    className?: string;
    onClick?: () => void;
}) {
    const sharedClassName = cn(
        'rounded-lg border-l-2 px-3 py-2 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.35)]',
        onClick && 'cursor-pointer transition-colors hover:bg-muted/35',
        className,
    );

    if (!message) {
        return (
            <div
                className={cn('border-muted-foreground/25 bg-muted/20', sharedClassName)}
                onClick={onClick}
                role={onClick ? 'button' : undefined}
                tabIndex={onClick ? 0 : undefined}
            >
                <p className="text-muted-foreground text-xs font-medium">
                    Original message unavailable
                </p>
            </div>
        );
    }

    const sender = SENDERS[message.senderId] ?? {
        name: message.senderId,
        initials: '?',
        avatarClass: 'bg-muted',
    };
    const preview = message.deletedAt
        ? 'This message was deleted'
        : getPlainTextFromHtml(message.content);

    return (
        <div
            className={cn('border-muted-foreground/35 bg-muted/30', sharedClassName)}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <p className="text-primary text-xs font-semibold">{sender.name}</p>
            <p className="text-muted-foreground line-clamp-2 text-xs leading-5">{preview}</p>
        </div>
    );
}

function MessageGroupItem({
    group,
    messagesById,
    highlightedMessageId,
    onReply,
    onDelete,
    onRestore,
    onJumpToMessage,
}: {
    group: MessageGroup;
    messagesById: Map<string, Message>;
    highlightedMessageId: string | null;
    onReply: (message: Message) => void;
    onDelete: (message: Message) => void;
    onRestore: (message: Message) => void;
    onJumpToMessage: (messageId: string) => void;
}) {
    const sender = SENDERS[group.senderId] ?? {
        name: group.senderId,
        initials: '?',
        avatarClass: 'bg-muted',
    };

    return (
        <div className="group flex gap-3 px-4 py-2 transition-colors md:px-6">
            <div className="mt-0.5 shrink-0">
                <Avatar className="ring-background size-9 shadow-sm ring-2">
                    <AvatarFallback className={cn('text-xs font-semibold', sender.avatarClass)}>
                        {sender.initials}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">{sender.name}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                    {group.messages.map((msg) => {
                        const repliedMessage = msg.replyToId
                            ? messagesById.get(msg.replyToId)
                            : undefined;

                        return (
                            <ContextMenu key={msg.id}>
                                <ContextMenuTrigger asChild>
                                    <div
                                        id={`thread-message-${msg.id}`}
                                        className={cn(
                                            'border-border/30 hover:border-border/40 hover:bg-muted/20 -mx-3 scroll-mt-28 rounded-lg border px-3 py-2 transition-colors',
                                            highlightedMessageId === msg.id &&
                                                'border-emerald-200/70',
                                        )}
                                    >
                                        {msg.replyToId ? (
                                            <ReplyPreview
                                                message={repliedMessage}
                                                className="mb-2 max-w-xl"
                                                onClick={() => onJumpToMessage(msg.replyToId!)}
                                            />
                                        ) : null}

                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                                            {msg.deletedAt ? (
                                                <div className="min-w-0">
                                                    <p className="text-muted-foreground bg-muted/50 rounded-md px-3 py-2 text-sm leading-6 italic">
                                                        This message was deleted on{' '}
                                                        {deletedAtFormatter.format(msg.deletedAt)}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div
                                                    className="prose-editor text-foreground/90 min-w-0 text-[15px] leading-7"
                                                    dangerouslySetInnerHTML={{
                                                        __html: msg.content,
                                                    }}
                                                />
                                            )}

                                            <p className="text-muted-foreground/70 shrink-0 text-[11px] leading-6 sm:pt-0.5">
                                                {timeFormatter.format(msg.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-36">
                                    <ContextMenuItem onSelect={() => onReply(msg)}>
                                        <IconCornerUpLeft />
                                        Reply
                                    </ContextMenuItem>
                                    {msg.deletedAt ? (
                                        <ContextMenuItem onSelect={() => onRestore(msg)}>
                                            <IconRestore />
                                            Restore
                                        </ContextMenuItem>
                                    ) : (
                                        <ContextMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onSelect={() => onDelete(msg)}
                                        >
                                            <IconTrash />
                                            Delete
                                        </ContextMenuItem>
                                    )}
                                </ContextMenuContent>
                            </ContextMenu>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function ProjectThreads() {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<RichTextEditorRef>(null);
    const isFirstRender = useRef(true);
    const shouldSkipNextAutoScroll = useRef(false);
    const highlightTimeoutRef = useRef<number | null>(null);
    const dateGroups = groupMessages(messages);
    const messagesById = useMemo(
        () => new Map(messages.map((message) => [message.id, message])),
        [messages],
    );
    const replyingTo = replyingToId ? messagesById.get(replyingToId) : undefined;

    useEffect(() => {
        const behavior: ScrollBehavior = isFirstRender.current ? 'instant' : 'smooth';
        isFirstRender.current = false;

        if (shouldSkipNextAutoScroll.current) {
            shouldSkipNextAutoScroll.current = false;
            return;
        }

        bottomRef.current?.scrollIntoView({ behavior });
    }, [messages]);

    const updateScrollToBottomVisibility = useCallback(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const distanceFromBottom =
            scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;

        setShowScrollToBottom(distanceFromBottom > 120);
    }, []);

    useEffect(() => {
        updateScrollToBottomVisibility();
    }, [messages, updateScrollToBottomVisibility]);

    useEffect(() => {
        return () => {
            if (highlightTimeoutRef.current) {
                window.clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, []);

    const sendMessage = useCallback(() => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                id: String(Date.now()),
                senderId: 'kubis',
                content: input,
                timestamp: new Date(),
                replyToId: replyingToId ?? undefined,
            },
        ]);
        setInput('');
        setReplyingToId(null);
        editorRef.current?.clear();
    }, [input, replyingToId]);

    const replyToMessage = useCallback((message: Message) => {
        setReplyingToId(message.id);
        editorRef.current?.focus();
    }, []);

    const deleteMessage = useCallback((message: Message) => {
        shouldSkipNextAutoScroll.current = true;

        setMessages((prev) =>
            prev.map((item) =>
                item.id === message.id
                    ? {
                          ...item,
                          deletedContent: item.content,
                          content: '',
                          deletedAt: new Date(),
                      }
                    : item,
            ),
        );

        setReplyingToId((currentId) => (currentId === message.id ? null : currentId));
    }, []);

    const restoreMessage = useCallback((message: Message) => {
        shouldSkipNextAutoScroll.current = true;

        setMessages((prev) =>
            prev.map((item) =>
                item.id === message.id
                    ? {
                          ...item,
                          content: item.deletedContent ?? item.content,
                          deletedContent: undefined,
                          deletedAt: undefined,
                      }
                    : item,
            ),
        );
    }, []);

    const jumpToMessage = useCallback((messageId: string) => {
        document.getElementById(`thread-message-${messageId}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });

        setHighlightedMessageId(messageId);

        if (highlightTimeoutRef.current) {
            window.clearTimeout(highlightTimeoutRef.current);
        }

        highlightTimeoutRef.current = window.setTimeout(() => {
            setHighlightedMessageId(null);
            highlightTimeoutRef.current = null;
        }, 1600);
    }, []);

    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <div className="from-background via-background to-muted/20 relative flex min-h-0 flex-1 flex-col overflow-hidden bg-linear-to-b">
            <div
                ref={scrollContainerRef}
                className="min-h-0 flex-1 overflow-y-auto py-3"
                onScroll={updateScrollToBottomVisibility}
            >
                {messages.length === 0 ? (
                    <Empty className="flex min-h-full items-center justify-center px-4">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <IconFolderCode />
                            </EmptyMedia>
                            <EmptyTitle>No Threads Yet</EmptyTitle>
                            <EmptyDescription>
                                Start the conversation by sending the first message for this
                                project.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    dateGroups.map((dg) => (
                        <div key={dg.dateKey} className="mb-3">
                            <DateSeparator label={dg.dateLabel} />
                            <div className="space-y-3">
                                {dg.groups.map((group, i) => (
                                    <MessageGroupItem
                                        key={`${dg.dateKey}-${i}`}
                                        group={group}
                                        messagesById={messagesById}
                                        highlightedMessageId={highlightedMessageId}
                                        onReply={replyToMessage}
                                        onDelete={deleteMessage}
                                        onRestore={restoreMessage}
                                        onJumpToMessage={jumpToMessage}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} className="h-2" />
            </div>

            {messages.length > 0 && showScrollToBottom ? (
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="border-border/70 bg-background/95 absolute right-5 bottom-40 z-30 size-10 rounded-full border shadow-lg backdrop-blur md:right-7"
                    onClick={scrollToBottom}
                >
                    <IconArrowDown size={18} />
                    <span className="sr-only">Scroll to bottom</span>
                </Button>
            ) : null}

            <div className="bg-background/95 sticky bottom-0 z-20 border-t px-4 pt-4 pb-4 shadow-[0_-14px_30px_-26px_rgba(0,0,0,0.55)] backdrop-blur md:px-6">
                <div className="relative">
                    {replyingToId ? (
                        <div className="bg-card mb-3 flex items-start gap-2 rounded-xl border p-2 shadow-sm">
                            <ReplyPreview message={replyingTo} className="min-w-0 flex-1" />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0"
                                onClick={() => setReplyingToId(null)}
                            >
                                <IconX size={16} />
                                <span className="sr-only">Cancel reply</span>
                            </Button>
                        </div>
                    ) : null}

                    <RichTextEditor
                        ref={editorRef}
                        value=""
                        onChange={setInput}
                        onSubmit={sendMessage}
                        placeholder="Write a message..."
                        className="border-border/80 bg-card focus-within:border-primary/30 focus-within:ring-primary/15 overflow-hidden rounded-xl shadow-sm ring-1 ring-transparent transition-shadow"
                        editorClassName="prose-editor min-h-[46px] max-h-52 overflow-y-auto py-3 pl-4 pr-28 text-sm leading-6 focus:outline-none"
                        toolbarRightContent={
                            <p className="text-muted-foreground/75 text-[11px]">
                                ⌘↵ / Ctrl↵ to send
                            </p>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
