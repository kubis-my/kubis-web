import type { ThreadMessage } from '@repo/commons/types/forge-service-schema.type';
import type { DateGroup, Message, MessageGroup } from './types';

export const timeFormatter = new Intl.DateTimeFormat('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
});
export const deletedAtFormatter = new Intl.DateTimeFormat('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

export function mapGqlMessage(msg: ThreadMessage, authUserId?: string): Message {
    return {
        id: msg.publicId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderInitials: msg.senderInitials,
        avatarClass:
            msg.senderId === authUserId ? 'bg-violet-500 text-white' : 'bg-sky-500 text-white',
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        replyToId: msg.replyToId ?? undefined,
        deletedAt: msg.deletedAt ? new Date(msg.deletedAt) : undefined,
    };
}

export function toLocalDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function getDateLabel(date: Date): string {
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

export function groupMessages(messages: Message[]): DateGroup[] {
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

export function getPlainTextFromJson(json: object | null): string {
    if (!json) return '';
    const texts: string[] = [];
    function collect(node: any) {
        if (node.text) texts.push(node.text);
        if (Array.isArray(node.content)) node.content.forEach(collect);
    }
    collect(json);
    return texts.join(' ').trim();
}
