import { IconCheck, IconCircle, IconCircleDashed, IconX } from '@tabler/icons-react';
import type { MilestoneStatus } from '../project-detail-container';

export const STATUS_CONFIG: Record<
    MilestoneStatus,
    { label: string; iconClass: string; badgeClass: string; Icon: React.ElementType }
> = {
    Done: {
        label: 'Done',
        Icon: IconCheck,
        iconClass: 'bg-green-500 text-white',
        badgeClass: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    },
    'In Progress': {
        label: 'In Progress',
        Icon: IconCircle,
        iconClass: 'bg-purple-500 text-white',
        badgeClass: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    },
    Upcoming: {
        label: 'Upcoming',
        Icon: IconCircleDashed,
        iconClass: 'bg-muted text-muted-foreground',
        badgeClass: 'bg-muted text-muted-foreground border-border',
    },
    Cancelled: {
        label: 'Cancelled',
        Icon: IconX,
        iconClass: 'bg-red-500 text-white',
        badgeClass: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    },
};

export const dateFormatter = new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' });
