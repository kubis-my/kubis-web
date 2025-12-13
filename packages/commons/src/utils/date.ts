import { DateTime } from "luxon";

export const formatDateTime = (dateString: string | undefined | null, zone = 'Asia/Kuala_Lumpur'): string => {
    if (!dateString) return '-';
    const dt = DateTime.fromISO(dateString, { zone });
    if (!dt.isValid) return dateString;
    return dt.toFormat('dd MMM yyyy, hh:mm a');
};