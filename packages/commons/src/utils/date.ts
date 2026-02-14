import { DateTime } from 'luxon';

export const formatDateTime = (
    dateString: string | undefined | null,
    config: { zone?: string; format: string } = {
        zone: 'Asia/Kuala_Lumpur',
        format: 'dd MMM yyyy, hh:mm a',
    },
): string => {
    if (!dateString) return '-';
    const dt = DateTime.fromISO(dateString, { zone: config.zone });
    if (!dt.isValid) return dateString;
    return dt.toFormat(config.format);
};

export const getDuration = (startDate: Date, endDate: Date) => {
    const diffMs = endDate.getTime() - startDate.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const parts = [];
    if (days > 0) parts.push(`${days} D`);
    if (hours > 0) parts.push(`${hours} H`);
    if (minutes > 0 && days === 0) parts.push(`${minutes} M`);

    return parts.length > 0 ? parts.join(' ') : '0 M';
};
