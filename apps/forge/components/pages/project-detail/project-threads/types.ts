import type { Attachment } from '@repo/commons/types/forge-service-schema.type';

export type Message = {
    id: string;
    senderId: string;
    senderName: string;
    senderInitials: string;
    avatarClass: string;
    content: object;
    timestamp: Date;
    replyToId?: string;
    deletedAt?: Date;
    attachments: Attachment[];
};

export type MessageGroup = {
    senderId: string;
    messages: Message[];
};

export type DateGroup = {
    dateLabel: string;
    dateKey: string;
    groups: MessageGroup[];
};
