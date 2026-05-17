export type Message = {
    id: string;
    senderId: string;
    senderName: string;
    senderInitials: string;
    avatarClass: string;
    content: string;
    timestamp: Date;
    replyToId?: string;
    deletedAt?: Date;
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

