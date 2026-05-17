import { Avatar, AvatarFallback } from '@repo/shadcn-ui/components/avatar';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@repo/shadcn-ui/components/context-menu';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { IconCornerUpLeft, IconRestore, IconTrash } from '@tabler/icons-react';
import { ReplyPreview } from './reply-preview';
import type { Message, MessageGroup } from './types';
import { deletedAtFormatter, timeFormatter } from './utils';

export function MessageGroupItem({
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
    const firstMsg = group.messages[0];
    const sender = firstMsg
        ? {
            name: firstMsg.senderName,
            initials: firstMsg.senderInitials,
            avatarClass: firstMsg.avatarClass,
        }
        : { name: group.senderId, initials: '?', avatarClass: 'bg-muted' };

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
