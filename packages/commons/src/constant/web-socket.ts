export const NotificationEvent = {
    NEW_LOGIN: 'new-login',
    TELEGRAM_2FA_UPDATED: 'telegram-2fa-updated',
};

export const SocketRoomEvent = {
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',
};

export const ThreadEvent = {
    MESSAGE_SENT: 'thread-message-sent',
    MESSAGE_DELETED: 'thread-message-deleted',
    MESSAGE_RESTORED: 'thread-message-restored',
    TYPING_START: 'typing-start',
    TYPING_STOP: 'typing-stop',
};

export const AttachmentEvent = {
    STATUS_CHANGED: 'attachment-status-changed',
};
