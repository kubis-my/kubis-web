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
import {
    DELETE_MESSAGE,
    GET_THREAD_MESSAGES,
    MARK_AS_READ,
    RESTORE_MESSAGE,
    SEND_MESSAGE,
} from './graphql';
import { MessageGroupItem } from './message-group-item';
import { ReplyPreview } from './reply-preview';
import { getThreadCache, setThreadCache } from './thread-cache';
import type { Message } from './types';
import { getPlainTextFromJson, groupMessages, mapGqlMessage } from './utils';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { toast } from 'sonner';
import { ThreadEvent } from '@repo/commons/constant/web-socket';
import { useSocket } from '@/shadcn/providers/socket-provider';
import { useAttachmentUpload } from '@/root/libs/attachments/use-attachment-upload';
import AttachmentPickerButton from '../shared/attachment-picker-button';
import AttachmentPreviewList from '../shared/attachment-preview-list';

export default function ProjectThreads() {
    const { projectId } = useParams<{ projectId: string }>();
    const { authUser } = useAuth();
    const { emit, on, off, isConnected } = useSocket();
    const { initialThreads, initialThreadsPageInfo } = useProjectDetail();

    const authUserId = authUser?.publicId;

    const [messages, setMessages] = useState<Message[]>(() =>
        initialThreads.map((msg) => mapGqlMessage(msg, authUserId)),
    );
    const [input, setInput] = useState<object | null>(null);
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [remoteTypingUserIds, setRemoteTypingUserIds] = useState<string[]>([]);

    const {
        attachments: pendingAttachments,
        addFiles,
        removeAttachment,
        reset: resetAttachments,
        completedPublicIds,
        isUploading,
    } = useAttachmentUpload();

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const topSentinelRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<RichTextEditorRef>(null);
    const isFirstRender = useRef(true);
    const shouldSkipNextAutoScroll = useRef(false);
    const highlightTimeoutRef = useRef<number | null>(null);
    const isLoadingMoreRef = useRef(false);
    const isTypingRef = useRef(false);
    const typingStopTimeoutRef = useRef<number | null>(null);
    const pageInfoRef = useRef<ThreadPageInfo>(initialThreadsPageInfo);
    const messagesRef = useRef<Message[]>(messages);
    const lastMarkAsReadIdRef = useRef<string | null>(null);
    const isRefetchingLatestRef = useRef(false);
    const refetchLatestPendingRef = useRef(false);

    messagesRef.current = messages;

    const [sendMutation] = useMutation(SEND_MESSAGE);
    const [deleteMutation] = useMutation(DELETE_MESSAGE);
    const [restoreMutation] = useMutation(RESTORE_MESSAGE);
    const [markAsReadMutation] = useMutation(MARK_AS_READ);

    const [fetchMoreMessages] = useLazyQuery(GET_THREAD_MESSAGES, {
        fetchPolicy: 'network-only',
    });

    const dateGroups = useMemo(() => groupMessages(messages), [messages]);
    const messagesById = useMemo(
        () => new Map(messages.map((message) => [message.id, message])),
        [messages],
    );
    const replyingTo = replyingToId ? messagesById.get(replyingToId) : undefined;

    const userNameById = useMemo(() => {
        const map = new Map<string, string>();
        for (const m of messages) {
            if (m.senderId && m.senderName && !map.has(m.senderId)) {
                map.set(m.senderId, m.senderName);
            }
        }
        return map;
    }, [messages]);

    useEffect(() => {
        const behavior: ScrollBehavior = isFirstRender.current ? 'instant' : 'smooth';
        isFirstRender.current = false;

        if (shouldSkipNextAutoScroll.current) {
            shouldSkipNextAutoScroll.current = false;
            return;
        }

        if (behavior === 'instant') {
            requestAnimationFrame(() => {
                scrollContainerRef.current?.scrollTo({
                    top: scrollContainerRef.current!.scrollHeight,
                    behavior,
                });
            });
        } else {
            scrollContainerRef.current?.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior,
            });
        }
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
            setMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const incoming = fetched.data
                    .map((msg) => mapGqlMessage(msg, authUserId))
                    .filter((m) => !existingIds.has(m.id));
                return [...incoming, ...prev];
            });
            pageInfoRef.current = fetched.pageInfo;

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

    const refetchLatestMessages = useCallback(async () => {
        if (!projectId) return;

        if (isRefetchingLatestRef.current) {
            refetchLatestPendingRef.current = true;
            return;
        }

        isRefetchingLatestRef.current = true;

        try {
            let result;
            try {
                result = await fetchMoreMessages({
                    variables: {
                        projectPublicId: projectId,
                        pagination: { take: THREAD_PAGINATION_SIZE },
                    },
                });
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return;
                throw err;
            }

            const fetched = result.data?.getThreadMessagesForForge;
            if (!fetched) return;

            const incoming = fetched.data.map((msg) => mapGqlMessage(msg, authUserId));

            setMessages((prev) => {
                const mergedById = new Map(prev.map((message) => [message.id, message]));

                for (const message of incoming) {
                    mergedById.set(message.id, message);
                }

                return Array.from(mergedById.values()).sort(
                    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
                );
            });

            const nextPageInfo =
                messagesRef.current.length <= incoming.length ? fetched.pageInfo : pageInfoRef.current;
            pageInfoRef.current = nextPageInfo;
        } finally {
            isRefetchingLatestRef.current = false;

            if (refetchLatestPendingRef.current) {
                refetchLatestPendingRef.current = false;
                refetchLatestMessages();
            }
        }
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

    useEffect(() => {
        updateScrollToBottomVisibility();
    }, [messages, updateScrollToBottomVisibility]);

    useEffect(() => {
        return () => {
            if (highlightTimeoutRef.current) {
                window.clearTimeout(highlightTimeoutRef.current);
            }

            if (typingStopTimeoutRef.current) {
                window.clearTimeout(typingStopTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        refetchLatestMessages();
    }, [refetchLatestMessages]);

    useEffect(() => {
        const latest = messages.at(-1);
        if (!latest || latest.id.startsWith('temp-') || !projectId) return;
        if (latest.id === lastMarkAsReadIdRef.current) return;

        lastMarkAsReadIdRef.current = latest.id;
        markAsReadMutation({
            variables: { messagePublicId: latest.id },
            update(cache) {
                cache.modify({
                    id: cache.identify({ __typename: 'Project', publicId: projectId }),
                    fields: {
                        userOverview(existing) {
                            return { ...existing, unreadCount: 0 };
                        },
                    },
                });
            },
        });
    }, [markAsReadMutation, projectId, messages]);

    useEffect(() => {
        if (!projectId) return;

        setThreadCache(projectId, messages, pageInfoRef.current);
    }, [messages, projectId]);

    useEffect(() => {
        if (!projectId) return;

        let cancelled = false;

        getThreadCache(projectId).then((cached) => {
            if (cancelled || !cached || cached.messages.length === 0) return;

            pageInfoRef.current = cached.pageInfo;

            const currentMessages = messagesRef.current;
            const cachedById = new Map(cached.messages.map((m) => [m.id, m]));
            const applyCachedState = (list: Message[]) => list.map((m) => cachedById.get(m.id) ?? m);

            if (currentMessages.length === 0) {
                shouldSkipNextAutoScroll.current = true;
                setMessages((prev) => (prev.length === 0 ? cached.messages : applyCachedState(prev)));
                return;
            }

            const existingIds = new Set(currentMessages.map((m) => m.id));
            const mergedCurrent = applyCachedState(currentMessages);
            const hasStateUpdates = mergedCurrent.some((m, i) => m !== currentMessages[i]);
            const notInCurrent = cached.messages.filter((m) => !existingIds.has(m.id));

            if (notInCurrent.length === 0 && !hasStateUpdates) return;

            if (notInCurrent.length === 0) {
                // Only state updates (delete/restore) - no scroll change
                shouldSkipNextAutoScroll.current = true;
                setMessages((prev) => applyCachedState(prev));
                return;
            }

            const oldestTs = currentMessages[0]!.timestamp.getTime();
            const newestTs = currentMessages[currentMessages.length - 1]!.timestamp.getTime();
            const older = notInCurrent.filter((m) => m.timestamp.getTime() < oldestTs);
            const newer = notInCurrent.filter((m) => m.timestamp.getTime() > newestTs);

            if (older.length > 0) {
                const scrollContainer = scrollContainerRef.current;
                const prevScrollHeight = scrollContainer?.scrollHeight ?? 0;
                const prevScrollTop = scrollContainer?.scrollTop ?? 0;

                shouldSkipNextAutoScroll.current = true;
                setMessages((prev) => [...older, ...applyCachedState(prev), ...newer]);

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (scrollContainer) {
                            scrollContainer.scrollTop =
                                prevScrollTop + (scrollContainer.scrollHeight - prevScrollHeight);
                        }
                    });
                });
            } else {
                // Only newer messages - scroll to bottom
                setMessages((prev) => [...applyCachedState(prev), ...newer]);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [projectId]);

    useEffect(() => {
        if (!isConnected || !projectId) return;

        const onTypingStart = (data: unknown) => {
            const { userId } = (data ?? {}) as { userId?: string };
            if (!userId || userId === authUserId) return;

            setRemoteTypingUserIds((current) =>
                current.includes(userId) ? current : [...current, userId],
            );
        };

        const onTypingStop = (data: unknown) => {
            const { userId } = (data ?? {}) as { userId?: string };
            if (!userId) return;

            setRemoteTypingUserIds((current) => current.filter((id) => id !== userId));
        };

        const onThreadMessageDeleted = (data: unknown) => {
            const { publicId } = (data ?? {}) as { publicId?: string };
            if (!publicId) return;

            shouldSkipNextAutoScroll.current = true;
            setMessages((prev) =>
                prev.map((m) => (m.id === publicId ? { ...m, deletedAt: new Date() } : m)),
            );
        };

        const onThreadMessageRestored = () => {
            shouldSkipNextAutoScroll.current = true;
            refetchLatestMessages();
        };

        on(ThreadEvent.MESSAGE_SENT, refetchLatestMessages);
        on(ThreadEvent.MESSAGE_DELETED, onThreadMessageDeleted);
        on(ThreadEvent.MESSAGE_RESTORED, onThreadMessageRestored);
        on(ThreadEvent.TYPING_START, onTypingStart);
        on(ThreadEvent.TYPING_STOP, onTypingStop);

        return () => {
            off(ThreadEvent.MESSAGE_SENT, refetchLatestMessages);
            off(ThreadEvent.MESSAGE_DELETED, onThreadMessageDeleted);
            off(ThreadEvent.MESSAGE_RESTORED, onThreadMessageRestored);
            off(ThreadEvent.TYPING_START, onTypingStart);
            off(ThreadEvent.TYPING_STOP, onTypingStop);
            setRemoteTypingUserIds([]);
        };
    }, [isConnected, projectId, authUserId, emit, on, off, refetchLatestMessages]);

    const emitTypingStop = useCallback(() => {
        if (!projectId || !isTypingRef.current) return;

        if (typingStopTimeoutRef.current) {
            window.clearTimeout(typingStopTimeoutRef.current);
            typingStopTimeoutRef.current = null;
        }

        emit(ThreadEvent.TYPING_STOP, { projectPublicId: projectId });
        isTypingRef.current = false;
    }, [emit, projectId]);

    const scheduleTypingStop = useCallback(() => {
        if (typingStopTimeoutRef.current) {
            window.clearTimeout(typingStopTimeoutRef.current);
        }

        typingStopTimeoutRef.current = window.setTimeout(() => {
            emitTypingStop();
        }, 1200);
    }, [emitTypingStop]);

    const handleInputChange = useCallback(
        (value: object | null) => {
            setInput(value);

            if (!projectId) return;

            const hasContent = getPlainTextFromJson(value).length > 0;

            if (!hasContent) {
                emitTypingStop();
                return;
            }

            if (!isTypingRef.current) {
                emit(ThreadEvent.TYPING_START, { projectPublicId: projectId });
                isTypingRef.current = true;
            }

            scheduleTypingStop();
        },
        [emit, emitTypingStop, projectId, scheduleTypingStop],
    );

    useEffect(() => {
        return () => {
            emitTypingStop();
        };
    }, [emitTypingStop]);

    const sendMessage = useCallback(async () => {
        if (isUploading) return;
        if ((!input && completedPublicIds.length === 0) || !projectId) return;

        const messageContent = input ?? { type: 'doc', content: [] };

        const tempId = `temp-${Date.now()}`;
        const tempMessage: Message = {
            id: tempId,
            senderId: authUserId ?? '',
            senderName: authUser?.nickname ?? authUser?.displayName ?? 'You',
            senderInitials: (
                (authUser?.nickname ?? authUser?.displayName ?? 'Y').at(0) ?? 'Y'
            ).toUpperCase(),
            avatarClass: 'bg-violet-500 text-white',
            content: messageContent,
            timestamp: new Date(),
            replyToId: replyingToId ?? undefined,
            attachments: [],
        };

        setMessages((prev) => [...prev, tempMessage]);
        setInput(null);
        setReplyingToId(null);
        editorRef.current?.clear();
        emitTypingStop();
        resetAttachments();

        try {
            const result = await sendMutation({
                variables: {
                    input: {
                        projectPublicId: projectId,
                        content: messageContent,
                        replyToPublicId: replyingToId ?? undefined,
                        attachmentPublicIds: completedPublicIds.length > 0 ? completedPublicIds : undefined,
                    },
                },
                errorPolicy: 'all',
            });

            if (hasGraphQLError(result.error)) {
                setMessages((prev) => prev.filter((item) => item.id !== tempId));

                toast.error('Something went wrong. Please try again.', {
                    position: 'top-center',
                });
                return;
            }

            const confirmed = result.data?.sendThreadMessageForForge;
            if (confirmed) {
                const confirmedMessage = mapGqlMessage(confirmed, authUserId);

                setMessages((prev) => {
                    const updatedById = new Map<string, Message>();

                    for (const message of prev) {
                        const nextMessage = message.id === tempId ? confirmedMessage : message;
                        updatedById.set(nextMessage.id, nextMessage);
                    }

                    return Array.from(updatedById.values()).sort(
                        (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
                    );
                });
            }
        } catch {
            setMessages((prev) => prev.filter((item) => item.id !== tempId));

            toast.error('Network error occurred. Please check your connection.', {
                position: 'top-center',
            });
        }
    }, [
        input,
        replyingToId,
        projectId,
        authUserId,
        authUser,
        sendMutation,
        emitTypingStop,
        isUploading,
        completedPublicIds,
        resetAttachments,
    ]);

    const replyToMessage = useCallback((message: Message) => {
        setReplyingToId(message.id);
        editorRef.current?.focus();
    }, []);

    const deleteMessage = useCallback(
        async (message: Message) => {
            if (message.senderId !== authUserId) {
                toast.error("You can't delete someone else's message", {
                    position: 'top-center',
                });
                return;
            }

            shouldSkipNextAutoScroll.current = true;

            setMessages((prev) =>
                prev.map((item) =>
                    item.id === message.id ? { ...item, deletedAt: new Date() } : item,
                ),
            );

            setReplyingToId((currentId) => (currentId === message.id ? null : currentId));

            const revertDelete = () =>
                setMessages((prev) =>
                    prev.map((item) =>
                        item.id === message.id ? { ...item, deletedAt: undefined } : item,
                    ),
                );

            try {
                const { error } = await deleteMutation({
                    variables: { publicId: message.id },
                    errorPolicy: 'all',
                });

                if (hasGraphQLError(error)) {
                    revertDelete();

                    toast.error('Something went wrong. Please try again.', {
                        position: 'top-center',
                    });
                }
            } catch {
                revertDelete();

                toast.error('Network error occurred. Please check your connection.', {
                    position: 'top-center',
                });
            }
        },
        [deleteMutation, authUserId],
    );

    const restoreMessage = useCallback(
        async (message: Message) => {
            shouldSkipNextAutoScroll.current = true;

            try {
                const result = await restoreMutation({
                    variables: { publicId: message.id },
                    errorPolicy: 'all',
                });

                if (hasGraphQLError(result.error)) {
                    const gqlError = result.error.errors?.[0] || result.error.graphQLErrors?.[0];

                    if (gqlError) {
                        const err = gqlError.extensions?.originalError as
                            | Record<string, unknown>
                            | undefined;

                        if (err?.statusCode === 403 && err?.id === 'SUPER_ADMIN_REQUIRED') {
                            toast.error('Only Kubis Team can restore deleted messages', {
                                position: 'top-center',
                            });
                            return;
                        }
                    }

                    toast.error('Something went wrong. Please try again.', {
                        position: 'top-center',
                    });
                    return;
                }

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
            } catch {
                toast.error('Network error occurred. Please check your connection.', {
                    position: 'top-center',
                });
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
                className="scrollbar-hide min-h-0 flex-1 overflow-y-auto py-3"
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
                    className={`border-border/70 bg-background/95 absolute right-5 z-30 size-10 rounded-full border shadow-lg backdrop-blur md:right-7 ${replyingToId ? 'bottom-56' : 'bottom-40'}`}
                    onClick={scrollToBottom}
                >
                    <IconArrowDown size={18} />
                    <span className="sr-only">Scroll to bottom</span>
                </Button>
            ) : null}

            <div className="bg-background/95 sticky bottom-0 z-20 border-t px-4 pt-4 pb-4 shadow-[0_-14px_30px_-26px_rgba(0,0,0,0.55)] backdrop-blur md:px-6">
                <div className="relative">
                    {remoteTypingUserIds.length > 0 ? (
                        <p className="text-muted-foreground mb-2 px-1 text-xs">
                            {remoteTypingUserIds.length === 1
                                ? `${userNameById.get(remoteTypingUserIds[0]!) ?? 'Someone'} is typing...`
                                : remoteTypingUserIds.length === 2
                                    ? `${userNameById.get(remoteTypingUserIds[0]!) ?? 'Someone'} and ${userNameById.get(remoteTypingUserIds[1]!) ?? 'someone'} are typing...`
                                    : `${remoteTypingUserIds.length} people are typing...`}
                        </p>
                    ) : null}

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

                    <AttachmentPreviewList
                        attachments={pendingAttachments}
                        onRemove={removeAttachment}
                    />

                    <RichTextEditor
                        ref={editorRef}
                        value={null}
                        onChange={handleInputChange}
                        onSubmit={sendMessage}
                        placeholder="Write a message..."
                        className="border-border/80 bg-card focus-within:border-primary/30 focus-within:ring-primary/15 overflow-hidden rounded-xl shadow-sm ring-1 ring-transparent transition-shadow"
                        editorClassName="prose-editor min-h-[46px] max-h-52 overflow-y-auto py-3 pl-4 pr-28 text-sm leading-6 focus:outline-none"
                        toolbarLeftContent={<AttachmentPickerButton onFilesSelected={addFiles} />}
                        toolbarRightContent={
                            <p className="text-muted-foreground/75 text-[11px]">
                                {isUploading ? 'Uploading…' : '⌘↵ / Ctrl↵ to send'}
                            </p>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
