'use client';

import { useCountdown } from '../hooks/use-countdown';

export default function Countdown(props: {
    expiresAt: number;
    onExpired: (isExpired: boolean) => void;
}) {
    const { formatted, expired } = useCountdown(props.expiresAt, (isExpired: boolean) =>
        props.onExpired(isExpired),
    );

    return (
        <div className="text-muted-foreground text-xs font-semibold">
            Time remaining:{' '}
            {!expired ? (
                <span>{formatted}</span>
            ) : (
                <span className="text-red-500">{formatted}</span>
            )}
        </div>
    );
}
