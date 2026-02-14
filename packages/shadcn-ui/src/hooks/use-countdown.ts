'use client';

import { useEffect, useState, useRef } from 'react';

export const useCountdown = (expiresAt: number, onExpire?: (isExpired: boolean) => void) => {
    const getLeft = () => Math.max(0, expiresAt - Date.now());
    const [timeLeft, setTimeLeft] = useState(getLeft);
    const expiredRef = useRef<boolean>(false);

    useEffect(() => {
        if (timeLeft === 0) return;
        const id = setInterval(() => setTimeLeft(getLeft()), 1_000);
        return () => clearInterval(id);
    }, [expiresAt]);

    useEffect(() => {
        const isExpired = timeLeft === 0;
        if (expiredRef.current === undefined) {
            expiredRef.current = isExpired;
            onExpire?.(isExpired);
        } else if (isExpired !== expiredRef.current) {
            expiredRef.current = isExpired;
            onExpire?.(isExpired);
        }
    }, [timeLeft, onExpire]);

    const totalSec = Math.ceil(timeLeft / 1_000);
    const hours = Math.floor(totalSec / 3_600);
    const minutes = Math.floor((totalSec % 3_600) / 60);
    const seconds = totalSec % 60;

    /** 02:04:05  (always HH:MM:SS, even if HH = 00) */
    const formatted =
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`;

    return { timeLeft, hours, minutes, seconds, formatted, expired: timeLeft === 0 };
};
