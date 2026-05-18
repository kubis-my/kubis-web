'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Button } from '@repo/shadcn-ui/components/button';
import RichTextEditor, {
    type RichTextEditorRef,
} from '@repo/shadcn-ui/components/rich-text-editor';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/shadcn/components/empty';
import { IconArrowDown, IconFolderCode, IconLoader2, IconX } from '@tabler/icons-react';
import { useAuth } from '@/shadcn/providers/auth-provider';
import type { ThreadPageInfo } from '@repo/commons/types/forge-service-schema.type';
import { THREAD_PAGINATION_SIZE } from '@/root/libs/constants';
import { useProjectDetail } from '../project-detail-container';
import { DateSeparator } from './date-separator';
import { DELETE_MESSAGE, GET_THREAD_MESSAGES, RESTORE_MESSAGE, SEND_MESSAGE } from './graphql';
import { MessageGroupItem } from './message-group-item';
import { ReplyPreview } from './reply-preview';
import { getThreadCache, setThreadCache } from './thread-cache';
import type { Message } from './types';
import { groupMessages, mapGqlMessage } from './utils';

export default function ProjectThreads() {
    const { projectId } = useParams<{ projectId: string }>();
    const { authUser } = useAuth();
    const { initialThreads, initialThreadsPageInfo } = useProjectDetail();

    const authUserId = authUser?.publicId;

    const [messages, setMessages] = useState<Message[]>(() =>
        initialThreads.map((msg) => mapGqlMessage(msg, authUserId)),
    );
    const [input, setInput] = useState('');
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const topSentinelRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<RichTextEditorRef>(null);
    const isFirstRender = useRef(true);
    const shouldSkipNextAutoScroll = useRef(false);
    const highlightTimeoutRef = useRef<number | null>(null);
    const isLoadingMoreRef = useRef(false);
    const pageInfoRef = useRef<ThreadPageInfo>(initialThreadsPageInfo);
    const messagesRef = useRef<Message[]>(messages);

    messagesRef.current = messages;

    const [sendMutation] = useMutation(SEND_MESSAGE);
    const [deleteMutation] = useMutation(DELETE_MESSAGE);
    const [restoreMutation] = useMutation(RESTORE_MESSAGE);

    const [fetchMoreMessages] = useLazyQuery(GET_THREAD_MESSAGES);

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

        scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior,
        });
    }, [messages]);

    const updateScrollToBottomVisibility = useCallback(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const distanceFromBottom =
            scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;

        setShowScrollToBottom(distanceFromBottom > 120);
    }, []);

    const loadMoreMessages = useCallback(async () => {
        const currentPageInfo = pageInfoRef.current;
        if (isLoadingMoreRef.current || !currentPageInfo.hasMore || !projectId) return;

        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
        shouldSkipNextAutoScroll.current = true;

        const scrollContainer = scrollContainerRef.current;
        const prevScrollHeight = scrollContainer?.scrollHeight ?? 0;
        const prevScrollTop = scrollContainer?.scrollTop ?? 0;

        const result = await fetchMoreMessages({
            variables: {
                projectPublicId: projectId,
                pagination: { take: THREAD_PAGINATION_SIZE, cursor: currentPageInfo.endCursor },
            },
        });

        const fetched = result.data?.getThreadMessagesForForge;
        if (fetched) {
            const existingIds = new Set(messagesRef.current.map((m) => m.id));
            const incoming = fetched.data
                .map((msg) => mapGqlMessage(msg, authUserId))
                .filter((m) => !existingIds.has(m.id));
            const accumulated = [...incoming, ...messagesRef.current];

            setMessages(accumulated);
            pageInfoRef.current = fetched.pageInfo;
            setThreadCache(projectId, accumulated, fetched.pageInfo);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (scrollContainer) {
                        scrollContainer.scrollTop =
                            prevScrollTop + (scrollContainer.scrollHeight - prevScrollHeight);
                    }
                });
            });
        }

        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
    }, [projectId, fetchMoreMessages, authUserId]);

    useEffect(() => {
        const sentinel = topSentinelRef.current;
        const scrollContainer = scrollContainerRef.current;
        if (!sentinel || !scrollContainer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) loadMoreMessages();
            },
            { root: scrollContainer, threshold: 0 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMoreMessages]);

    const handleScroll = useCallback(() => {
        updateScrollToBottomVisibility();
    }, [updateScrollToBottomVisibility]);

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

    useEffect(() => {
        if (!projectId) return;

        let cancelled = false;

        getThreadCache(projectId).then((cached) => {
            if (cancelled || !cached || cached.messages.length === 0) return;

            const scrollContainer = scrollContainerRef.current;
            const prevScrollHeight = scrollContainer?.scrollHeight ?? 0;
            const prevScrollTop = scrollContainer?.scrollTop ?? 0;

            shouldSkipNextAutoScroll.current = true;
            pageInfoRef.current = cached.pageInfo;

            setMessages((current) => {
                if (current.length === 0) return cached.messages;

                const oldestTs = current[0]!.timestamp.getTime();
                const older = cached.messages.filter((m) => m.timestamp.getTime() < oldestTs);

                return older.length > 0 ? [...older, ...current] : current;
            });

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (scrollContainer) {
                        scrollContainer.scrollTop =
                            prevScrollTop + (scrollContainer.scrollHeight - prevScrollHeight);
                    }
                });
            });
        });

        return () => {
            cancelled = true;
        };
    }, [projectId]);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || !projectId) return;

        const tempId = `temp-${Date.now()}`;
        const tempMessage: Message = {
            id: tempId,
            senderId: authUserId ?? '',
            senderName: authUser?.nickname ?? authUser?.displayName ?? 'You',
            senderInitials: (
                (authUser?.nickname ?? authUser?.displayName ?? 'Y').at(0) ?? 'Y'
            ).toUpperCase(),
            avatarClass: 'bg-violet-500 text-white',
            content: input,
            timestamp: new Date(),
            replyToId: replyingToId ?? undefined,
        };

        setMessages((prev) => [...prev, tempMessage]);
        setInput('');
        setReplyingToId(null);
        editorRef.current?.clear();

        const result = await sendMutation({
            variables: {
                input: {
                    projectPublicId: projectId,
                    content: input,
                    replyToPublicId: replyingToId ?? undefined,
                },
            },
        });

        const confirmed = result.data?.sendThreadMessageForForge;
        if (confirmed) {
            setMessages((prev) =>
                prev.map((m) => (m.id === tempId ? mapGqlMessage(confirmed, authUserId) : m)),
            );
        }
    }, [input, replyingToId, projectId, authUserId, authUser, sendMutation]);

    const replyToMessage = useCallback((message: Message) => {
        setReplyingToId(message.id);
        editorRef.current?.focus();
    }, []);

    const deleteMessage = useCallback(
        async (message: Message) => {
            shouldSkipNextAutoScroll.current = true;

            setMessages((prev) =>
                prev.map((item) =>
                    item.id === message.id ? { ...item, deletedAt: new Date() } : item,
                ),
            );

            setReplyingToId((currentId) => (currentId === message.id ? null : currentId));

            await deleteMutation({ variables: { publicId: message.id } });
        },
        [deleteMutation],
    );

    const restoreMessage = useCallback(
        async (message: Message) => {
            shouldSkipNextAutoScroll.current = true;

            const result = await restoreMutation({ variables: { publicId: message.id } });
            const restored = result.data?.restoreThreadMessageForForge;

            if (restored) {
                setMessages((prev) =>
                    prev.map((item) =>
                        item.id === restored.publicId
                            ? { ...item, content: restored.content, deletedAt: undefined }
                            : item,
                    ),
                );
            }
        },
        [restoreMutation],
    );

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
        scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, []);

    return (
        <div className="from-background via-background to-muted/20 relative flex min-h-0 flex-1 flex-col overflow-hidden bg-linear-to-b">
            <div
                ref={scrollContainerRef}
                className="min-h-0 flex-1 overflow-y-auto py-3"
                onScroll={handleScroll}
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
                    <>
                        <div ref={topSentinelRef} className="h-px" />
                        {isLoadingMore ? (
                            <div className="flex items-center justify-center py-3">
                                <IconLoader2
                                    size={16}
                                    className="text-muted-foreground animate-spin"
                                />
                            </div>
                        ) : null}
                        {dateGroups.map((dg) => (
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
                        ))}
                    </>
                )}
                <div className="h-2" />
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
