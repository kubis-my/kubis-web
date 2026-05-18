import { cn } from '@repo/shadcn-ui/lib/utils';
import type { Message } from './types';
import { getPlainTextFromJson } from './utils';

export function ReplyPreview({
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

    const preview = message.deletedAt
        ? 'This message was deleted'
        : getPlainTextFromJson(message.content);

    return (
        <div
            className={cn('border-muted-foreground/35 bg-muted/30', sharedClassName)}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <p className="text-primary text-xs font-semibold">{message.senderName}</p>
            <p className="text-muted-foreground line-clamp-2 text-xs leading-5">{preview}</p>
        </div>
    );
}
